// app/api/get_properties/route.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

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
      "6feb6d4c-f3c3-594b-b829-c6a377b4bbb4";

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

    // collect debug frames if toggled on
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
          if (line.startsWith("event:")) eventName = line.slice(6).trim();
          else if (line.startsWith("data:")) dataChunks.push(line.slice(5).trim());
        }
        if (!dataChunks.length) continue;

        const raw = dataChunks.join("\n");
        if (!raw || raw === "[DONE]") continue;

        let payload: any;
        try { payload = JSON.parse(raw); } catch { continue; }

        if (process.env.DEBUG_SSE === "1") {
          debugFrames.push({
            event: eventName,
            sample: Array.isArray(payload) ? payload[0] : payload,
          });
        }

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

        if (eventName === "updates" && payload && typeof payload === "object") {
          for (const [k, v] of Object.entries(payload)) (updates as any)[k] = v;
          continue;
        }

        if (eventName === "values") {
          finalValues = payload;
          continue;
        }

        // token fallback if messages/* were not used
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

    // ---------- lift properties robustly ----------
    const lifted = liftEverywhere(finalValues, updates, debugFrames);

    return NextResponse.json({
      apiResponse: {
        assistant: assistantText || "",
        updates,
        values: finalValues,
        properties: lifted.properties,
        api_call_parameters: lifted.apiCallParams ?? null,
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

function tryParseJSON<T = any>(v: any): T | null {
  if (v == null) return null;
  if (typeof v !== "string") return v as T;
  try { return JSON.parse(v) as T; } catch { return null; }
}

function tryParseArray(v: any): any[] | null {
  if (Array.isArray(v)) return v;
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try { const parsed = JSON.parse(s); return Array.isArray(parsed) ? parsed : null; } catch {}
    }
  }
  return null;
}

function looksLikePropertyArray(arr: any[]): boolean {
  if (!arr.length || typeof arr[0] !== "object") return false;
  const it = arr[0] as any;
  return (
    "price" in it || "address" in it ||
    "latitude" in it || "lat" in it ||
    "longitude" in it || "lng" in it ||
    "zpid" in it
  );
}

// pick an array from common fields (including nested { data: ... } with JSON)
function pickArrayFromAny(obj: any): any[] | undefined {
  if (!obj || typeof obj !== "object") return undefined;

  // If this is a wrapper like { data: "{\"props\":[...]}" } unwrap it
  const maybeData = (obj as any).data;
  if (typeof maybeData === "string") {
    const parsed = tryParseJSON<any>(maybeData);
    const arr = pickArrayFromAny(parsed);
    if (arr && arr.length) return arr;
  } else if (maybeData && typeof maybeData === "object") {
    const arr = pickArrayFromAny(maybeData);
    if (arr && arr.length) return arr;
  }

  const keys = [
    "json_to_properties", "properties", "properties_found",
    "listings", "results", "search_results", "matched_properties",
    "props" // <-- important for the server case you saw
  ];

  for (const k of keys) {
    const raw = (obj as any)[k];
    if (raw == null) continue;

    // Node returns { properties: [...] } or { props: [...] }
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      const inner =
        (raw as any).properties ??
        (raw as any).listings ??
        (raw as any).results ??
        (raw as any).props ??
        (raw as any).data;

      // inner could itself be a stringified object/array
      const innerParsedObj = tryParseJSON<any>(inner);
      if (innerParsedObj && typeof innerParsedObj === "object") {
        const arrFromInner = pickArrayFromAny(innerParsedObj);
        if (arrFromInner && arrFromInner.length) return arrFromInner;
      }

      const arrInner = tryParseArray(inner);
      if (arrInner && looksLikePropertyArray(arrInner)) return arrInner;
    }

    // direct array or stringified array
    const arr = tryParseArray(raw);
    if (arr && looksLikePropertyArray(arr)) return arr;

    // stringified object like "{\"props\":[...]}"
    const asObj = tryParseJSON<any>(raw);
    if (asObj && typeof asObj === "object") {
      const arrFromObj = pickArrayFromAny(asObj);
      if (arrFromObj && arrFromObj.length) return arrFromObj;
    }
  }

  // Last resort: first array-of-objects that "looks like" listings
  for (const [, v] of Object.entries(obj)) {
    // unwrap nested data quickly
    if (v && typeof v === "object") {
      const arrNested = pickArrayFromAny(v);
      if (arrNested && arrNested.length) return arrNested;
    }
    const arr = tryParseArray(v);
    if (arr && looksLikePropertyArray(arr)) return arr;
    const asObj = tryParseJSON<any>(v);
    if (asObj && typeof asObj === "object") {
      const arrFromObj = pickArrayFromAny(asObj);
      if (arrFromObj && arrFromObj.length) return arrFromObj;
    }
  }

  return undefined;
}

function liftEverywhere(values: any, updates: any, debugFrames: Array<{event?: string; sample?: any}>) {
  // 1) values event
  const fromValues = pickArrayFromAny(values);
  if (fromValues?.length) {
    return {
      properties: fromValues,
      apiCallParams: values?.api_call_parameters ?? values?.api_cal_parameters ?? null,
    };
  }

  // 2) updates stream
  const fromUpdates = pickArrayFromAny(updates);
  if (fromUpdates?.length) {
    return {
      properties: fromUpdates,
      apiCallParams: updates?.api_call_parameters ?? updates?.api_cal_parameters ?? null,
    };
  }

  // 3) scan _sse_debug -> messages/complete content -> { status, data: "{\"props\": [...] }"}
  if (Array.isArray(debugFrames)) {
    for (let i = debugFrames.length - 1; i >= 0; i--) {
      const f = debugFrames[i];
      if (f?.event !== "messages/complete") continue;
      const content = f.sample?.content;
      const parsedComplete = tryParseJSON<any>(content);
      if (!parsedComplete) continue;

      // unwrap .data which might be a stringified object that holds props
      const inner = tryParseJSON<any>(parsedComplete.data) ?? parsedComplete.data;
      const arr = pickArrayFromAny(inner);
      if (arr?.length) return { properties: arr, apiCallParams: inner?.api_call_parameters ?? null };
    }
  }

  return { properties: [] as any[], apiCallParams: null };
}
