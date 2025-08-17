// app/api/get_properties/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Ensure Node runtime so we can read streamed bodies
export const runtime = "nodejs";

type ChatMsg = { role: "user" | "assistant"; content: string };

export async function POST(
  req: NextRequest
): Promise<NextResponse<{ apiResponse?: any; error?: string }>> {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const { input, messages = [], thread_id } = await req.json();

    const base =
      process.env.LANGGRAPH_URL ??
      "https://aigenthome-prod-0c76a5f8e54f5c19b10fe56b657fc60b.us.langgraph.app";
    const key = process.env.LANGGRAPH_API_KEY;
    const assistant =
      process.env.LANGGRAPH_ASSISTANT_ID ??
      "6feb6d4c-f3c3-594b-b829-c6a377b4bbb4"; // Graph "Real Estate"

    if (!key) throw new Error("LANGGRAPH_API_KEY is not defined");

    const msgs: ChatMsg[] = Array.isArray(messages) ? [...messages] : [];
    if (input) msgs.push({ role: "user", content: String(input) });

    const upstream = await fetch(`${base}/runs/stream`, {
      method: "POST",
      headers: {
        "X-Api-Key": key,
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        assistant_id: assistant,
        input: { messages: msgs },
        ...(thread_id ? { config: { thread_id } } : {}),
        // 👇 CRITICAL: include values
        stream_mode: ["messages", "updates", "values"],
      }),
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text().catch(() => "");
      throw new Error(`Upstream error: ${upstream.status} ${text}`);
    }

    const reader = upstream.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let assistantText = "";
    let sawMessages = false;
    const updates: Record<string, unknown> = {};
    let finalValues: any = undefined;

    // Optional: capture debug lines to return to client if needed
    const debugFrames: Array<{ event?: string; sample?: any }> = [];

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      buffer = buffer.replace(/\r\n/g, "\n");
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        if (!frame.trim()) continue;

        const lines = frame.split("\n");
        let eventName: string | undefined;
        const dataChunks: string[] = [];

        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataChunks.push(line.slice(5).trim());
          }
        }

        if (!dataChunks.length) continue;
        const raw = dataChunks.join("\n");
        if (!raw || raw === "[DONE]") continue;

        let payload: any;
        try {
          payload = JSON.parse(raw);
        } catch {
          continue;
        }

        // for debug
        if (process.env.DEBUG_SSE === "1") {
          debugFrames.push({
            event: eventName,
            sample: Array.isArray(payload) ? payload[0] : payload,
          });
        }

        // 1) Prefer messages/* events for assistant text
        if (eventName?.startsWith("messages/")) {
          const arr = Array.isArray(payload) ? payload : [];
          const ai = arr.find((m: any) => m?.type === "ai");
          const content = typeof ai?.content === "string" ? ai.content : "";
          if (content) {
            assistantText = content;
            sawMessages = true;
          }
          continue;
        }

        // 2) updates: merge last seen values (can be null during transitions)
        if (eventName === "updates" && payload && typeof payload === "object") {
          for (const [k, v] of Object.entries(payload)) {
            (updates as any)[k] = v;
          }
          continue;
        }

        // 3) values: final state (this is where your listings should appear)
        if (eventName === "values") {
          finalValues = payload;
          continue;
        }

        // 4) token streams fallback (if messages/* weren’t used)
        const token =
          payload?.data?.chunk?.content ??
          payload?.data?.chunk?.text ??
          payload?.data?.delta ??
          payload?.token ??
          "";
        if (!sawMessages && typeof token === "string" && token) {
          assistantText += token;
        }
      }
    }

    // Try to lift properties and call params from either final values or updates
    const lifted = liftFromValuesOrUpdates(finalValues, updates);

    return NextResponse.json({
      apiResponse: {
        assistant: assistantText || "",
        updates,
        values: finalValues, // 👈 expose final values for the page’s fallback
        properties: lifted.properties, // convenience for any legacy UI
        api_call_parameters: lifted.apiCallParams,
        thread_id: thread_id ?? null,
        ...(process.env.DEBUG_SSE === "1" ? { _sse_debug: debugFrames } : {}),
      },
    });
  } catch (error: unknown) {
    console.error("get_properties error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

/* ---------------- helpers ---------------- */

function tryParseArray(v: any): any[] | null {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        return Array.isArray(parsed) ? parsed : null;
      } catch {}
    }
  }
  return null;
}

function looksLikePropertyArray(arr: any[]): boolean {
  if (!arr.length || typeof arr[0] !== "object") return false;
  const it = arr[0] as any;
  return (
    "price" in it ||
    "address" in it ||
    "latitude" in it ||
    "lat" in it ||
    "longitude" in it ||
    "lng" in it
  );
}

function pickPropertiesFromObject(obj: any): any[] | undefined {
  if (!obj || typeof obj !== "object") return undefined;

  const keys = [
    "json_to_properties",  // your node name from the trace
    "properties",
    "properties_found",
    "listings",
    "results",
    "search_results",
    "matched_properties",
  ];

  for (const k of keys) {
    const raw = (obj as any)[k];
    if (raw == null) continue;

    // Sometimes nodes return { properties: [...] }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const inner =
        (raw as any).properties ??
        (raw as any).listings ??
        (raw as any).results ??
        (raw as any).data;
      const arrInner = tryParseArray(inner);
      if (arrInner && looksLikePropertyArray(arrInner)) return arrInner;
    }

    const arr = tryParseArray(raw);
    if (arr && looksLikePropertyArray(arr)) return arr;
  }

  // Fallback: first array-of-objects that "looks like" listings
  for (const [, v] of Object.entries(obj)) {
    const arr = tryParseArray(v);
    if (arr && looksLikePropertyArray(arr)) return arr;
  }
  return undefined;
}

function liftFromValuesOrUpdates(values: any, updates: any): {
  properties?: any[];
  apiCallParams?: any;
} {
  const fromValues = pickPropertiesFromObject(values);
  if (fromValues) {
    const params = values?.api_call_parameters ?? values?.api_cal_parameters;
    return { properties: fromValues, apiCallParams: params };
  }

  const fromUpdates = pickPropertiesFromObject(updates);
  if (fromUpdates) {
    const params = updates?.api_call_parameters ?? updates?.api_cal_parameters;
    return { properties: fromUpdates, apiCallParams: params };
  }

  return {};
}
