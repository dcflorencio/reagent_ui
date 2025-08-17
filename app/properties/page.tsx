"use client"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../properties/components/app-sidebar"
import MenubarDemo from "@/components/Menubar"
import PropertyMap from "@/components/PropertyMap"
import ChatBar from "./Chat"
import PropertyCard from "@/app/properties/components/PropertyCardWithSavedFeature"
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingChatBar from "@/components/FloatingChatbar"
import { useState, useEffect, useRef } from "react"
import React from "react"
import { Loader2 } from "lucide-react"
import { createClient } from "@/app/utils/supabase/client"

type assessmentType = {
  role: "user" | "assistant";
  content: string;
}

type ApiResponseShape = {
  assistant?: string;
  updates?: Record<string, unknown>;
  thread_id?: string | null;
  values?: any;
  properties?: any[];
  _sse_debug?: Array<{
    event: string;
    sample?: any;
  }>;
};

// --- helpers ---------------------------------------------------------------

/** Normalize one raw listing to the shape our UI expects. */
function normalizeListing(raw: any) {
  if (!raw || typeof raw !== "object") return null;

  const lat = raw.latitude ?? raw.lat ?? raw.latLong?.latitude ?? null;
  const lng = raw.longitude ?? raw.lon ?? raw.long ?? raw.latLong?.longitude ?? null;

  // Prefer absolute detailUrl if available, otherwise prefix Zillow path
  let detailUrl: string | undefined = raw.detailUrl;
  if (detailUrl && !/^https?:\/\//i.test(detailUrl)) {
    detailUrl = `https://www.zillow.com${detailUrl}`;
  }

  return {
    id: raw.zpid ?? raw.id ?? raw._id ?? detailUrl ?? Math.random().toString(36).slice(2),
    address: raw.address ?? raw.streetAddress ?? raw.addr,
    price: raw.price ?? raw.listPrice ?? raw.amount,
    bedrooms: raw.bedrooms ?? raw.beds,
    bathrooms: raw.bathrooms ?? raw.baths,
    livingArea: raw.livingArea ?? raw.sqft ?? raw.lotAreaValue,
    latitude: lat,
    longitude: lng,
    imgSrc: raw.imgSrc ?? raw.image ?? raw.photoUrl,
    detailUrl,
    listingStatus: raw.listingStatus,
    propertyType: raw.propertyType,
    zpid: raw.zpid,
    raw, // keep raw for anything the card might want
  };
}

/** From `apiResponse.values` try common keys where props might land. */
function extractFromValues(values: any): any[] | null {
  if (!values) return null;
  const candidates = [
    values.json_to_properties,
    values.properties,
    values.props,
    values.results,
    values.data,
  ].filter(Boolean);

  for (const c of candidates) {
    if (Array.isArray(c)) return c;
    if (c && typeof c === "object") {
      if (Array.isArray(c.props)) return c.props;
      if (Array.isArray(c.properties)) return c.properties;
      if (Array.isArray(c.results)) return c.results;
      if (Array.isArray(c.data)) return c.data;
    }
  }
  return null;
}

/** Pull the completed payload from `_sse_debug → messages/complete → sample.content`. */
function extractFromSseDebug(debug: ApiResponseShape["_sse_debug"]): any[] | null {
  if (!Array.isArray(debug)) return null;
  const complete = debug.find(e => e?.event === "messages/complete" && e?.sample?.content);
  if (!complete) return null;

  try {
    // `content` is a JSON string like: {"status":200,"data":"{\"props\":[ ... ]}"}
    const contentObj = JSON.parse(complete.sample.content);
    let data = contentObj?.data ?? contentObj?.props ?? contentObj?.properties ?? null;

    // In your trace, `data` is itself a stringified JSON with `props: [...]`
    if (typeof data === "string") {
      try { data = JSON.parse(data); } catch { /* ignore */ }
    }

    if (!data) return null;

    // Accept common shapes
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.props)) return data.props;
    if (Array.isArray(data.properties)) return data.properties;
    if (Array.isArray(data.results)) return data.results;
    if (Array.isArray(data.data)) return data.data;

    // Sometimes the array is under an unknown single key
    const firstArray = Object.values(data).find(v => Array.isArray(v)) as any[] | undefined;
    return firstArray ?? null;
  } catch {
    return null;
  }
}

/** Master extractor that returns `[properties, sourceTag]`. */
function extractProperties(apiResponse: ApiResponseShape): [any[], string] {
  // 1) direct
  if (Array.isArray(apiResponse?.properties) && apiResponse.properties.length > 0) {
    return [apiResponse.properties, "apiResponse.properties"];
  }
  // 2) values-based
  const fromValues = extractFromValues(apiResponse?.values);
  if (Array.isArray(fromValues) && fromValues.length > 0) {
    return [fromValues, "apiResponse.values"];
  }
  // 3) SSE debug -> messages/complete
  const fromSse = extractFromSseDebug(apiResponse?._sse_debug);
  if (Array.isArray(fromSse) && fromSse.length > 0) {
    return [fromSse, "_sse_debug.messages/complete"];
  }
  return [[], "none"];
}

// --- component -------------------------------------------------------------

export default function Page() {
  const [loadingPage, setLoadingPage] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [messages, setMessages] = useState<assessmentType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiCalParameters, setApiCalParameters] = useState<any[]>([]);
  const hasProperties = properties.length > 0;
  const [savedChatId, setSavedChatId] = useState<string>("");
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user);
    }
    checkUser();
  }, [supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    setLoadingPage(false);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (savedChatId) {
      handleSaveIntoExistingChat(savedChatId, messages, properties, apiCalParameters);
    } else {
      handleSaveChat(messages, setSavedChatId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, properties, user]);

  // --- network handlers ----------------------------------------------------

  const consumeApiResponse = (apiResponse: ApiResponseShape, label: string) => {
    const [rawProps, source] = extractProperties(apiResponse);
    console.log(`[get_properties] extractor=${source} (${label}) raw count=`, rawProps?.length ?? 0);

    if (Array.isArray(rawProps) && rawProps.length > 0) {
      const normalized = rawProps.map(normalizeListing).filter(Boolean);
      setProperties(normalized);

      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            normalized.length > 0
              ? `${normalized.length} properties match your criteria:`
              : "No properties found that match your criteria.",
        },
      ]);

      // If the graph sent back api_call_parameters somewhere, try to retain it
      const maybeParams =
        apiResponse?.values?.api_call_parameters ??
        (apiResponse as any)?.api_call_parameters ??
        null;
      if (Array.isArray(maybeParams) && maybeParams.length > 0) {
        setApiCalParameters(maybeParams);
      }

      return true;
    }

    // Otherwise, try assistant text (if any)
    const assistantText =
      apiResponse?.assistant ??
      (apiResponse as any)?.messages?.at?.(-1)?.content ??
      "";
    if (assistantText) {
      setMessages(prev => [...prev, { role: "assistant", content: assistantText }]);
      return true;
    }

    return false;
  };

  const handleNext = async (input: string) => {
    if (input.trim() === "") return;

    setIsLoading(true);
    try {
      setMessages(prev => [...prev, { role: "user", content: input }]);

      const res = await fetch("/api/get_properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, messages }),
      });

      const json = await res.json();
      const apiResponse: ApiResponseShape = json?.apiResponse ?? {};

      // DEV: See exactly what came back
      console.log("[get_properties] raw apiResponse", apiResponse);

      const consumed = consumeApiResponse(apiResponse, "handleNext");
      if (!consumed) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "I couldn't parse any listings from the response." },
        ]);
      }
    } catch (err) {
      console.error("Error in handleNext:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong fetching properties." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyOrRent = async (type: string) => {
    setIsLoading(true);
    try {
      setMessages(prev => [...prev, { role: "user", content: type }]);

      const res = await fetch("/api/get_properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: type, messages }),
      });

      const json = await res.json();
      const apiResponse: ApiResponseShape = json?.apiResponse ?? {};

      console.log("[get_properties] raw apiResponse", apiResponse);

      const consumed = consumeApiResponse(apiResponse, "handleBuyOrRent");
      if (!consumed) {
        setMessages(prev => [
          ...prev,
          { role: "assistant", content: "I couldn't parse any listings from the response." },
        ]);
      }
    } catch (err) {
      console.error("Error in handleBuyOrRent:", err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Something went wrong fetching properties." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- saved chats ---------------------------------------------------------

  const handleSavedChatClick = async (id: string) => {
    if (!user) return;
    setLoadingPage(true);
    setSavedChatId(id);
    await handleLoadSavedChat(id, setMessages, setProperties, setApiCalParameters);
    setLoadingPage(false);
  };

  const handleNewChatClick = async () => {
    setSavedChatId("");
    setMessages([]);
    setProperties([]);
    setApiCalParameters([]);
  };

  if (loadingPage) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={false} className="h-screen w-full">
      <AppSidebar handleSavedChatClick={handleSavedChatClick} handleNewChatClick={handleNewChatClick} />
      <SidebarInset>
        <div className="flex flex-row justify-center items-center">
          <SidebarTrigger className="ml-3" />
          <div className="flex-grow">
            <MenubarDemo />
          </div>
        </div>

        <ResizablePanelGroup
          direction={isMobile ? "vertical" : "horizontal"}
          className="rounded-lg border h-full"
        >
          <ResizablePanel defaultSize={50}>
            <ResizablePanelGroup direction={properties.length ? "vertical" : "horizontal"}>
              <ResizablePanel defaultSize={50}>
                <PropertyMap properties={properties} />
              </ResizablePanel>

              {!isMobile && (
                <>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={50}>
                    <ChatBar
                      messages={messages}
                      handleBuyOrRent={handleBuyOrRent}
                      handleNext={handleNext}
                      isProperties={properties.length > 0}
                      apiCalParameters={apiCalParameters}
                      isLoading={isLoading}
                    />
                  </ResizablePanel>
                </>
              )}
            </ResizablePanelGroup>
          </ResizablePanel>

          {properties.length > 0 && (
            <>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <ScrollArea className="h-full rounded-xl border-t-2 border-green-500">
                  <PropertyCard properties={properties} />
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>

        {isMobile && (
          <FloatingChatBar
            messages={messages}
            handleBuyOrRent={handleBuyOrRent}
            handleNext={handleNext}
            properties={properties}
            apiCalParameters={apiCalParameters}
          />
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}

// --- persistence helpers (unchanged) --------------------------------------

const handleSaveChat = async (messages: assessmentType[], setSavedChatId: (id: string) => void) => {
  if (messages.length === 0) {
    console.log("No messages provided");
    return;
  }
  try {
    const response = await fetch('/api/save_chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const responseData = await response.json();
    console.log("responseData from save chat", responseData);
    setSavedChatId(responseData[0].id);
  } catch (error) {
    console.error("Error saving chat:", error);
  }
}

const handleLoadSavedChat = async (
  id: string,
  setMessages: (messages: assessmentType[]) => void,
  setProperties: (properties: any[]) => void,
  setApiCalParameters: (apiCalParameters: any[]) => void
) => {
  try {
    if (!id) {
      console.error("No ID provided");
      return;
    }
    const response = await fetch(`/api/get_saved_chat_by_id?id=${id}`);
    const responseData = await response.json();
    if (responseData.length > 0) {
      const historyMessages = responseData[0].messages || [];
      const historyProperties = responseData[0].properties || [];
      setMessages(historyMessages);
      setProperties(historyProperties);
      if (responseData[0].api_cal_parameters) {
        setApiCalParameters(responseData[0].api_cal_parameters);
      }
    }
  } catch (error) {
    console.error("Error loading saved chat:", error);
  }
}

const handleSaveIntoExistingChat = async (
  id: string,
  messages: assessmentType[],
  properties: any[],
  apiCalParameters: any[]
) => {
  if (messages.length === 0 && properties.length === 0) {
    console.log("No messages or properties provided");
    return;
  }
  try {
    await fetch(`/api/save_into_existing_chat?id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, properties, apiCalParameters }),
    });
  } catch (error) {
    console.error("Error saving into existing chat:", error);
  }
}
