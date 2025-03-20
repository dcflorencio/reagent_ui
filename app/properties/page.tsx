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
// import { testProperties } from "../properties/demoProperties"
import ChatBar from "./Chat"
// import PropertyCard from "@/components/PropertyCard"
import PropertyCard from "@/app/properties/components/PropertyCardWithSavedFeature"
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingChatBar from "@/components/FloatingChatbar"
import { useState, useEffect, useRef } from "react"
import React from "react"
import { Loader2 } from "lucide-react"
// import { assessmentType } from "../properties/page"
type assessmentType = {
    role: "user" | "assistant";
    content: string;
}
import { createClient } from "@/app/utils/supabase/client"
export default function Page() {
    // const [properties, setProperties] = useState(testProperties);
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [messages, setMessages] = useState<assessmentType[]>([]);
    const [input, setInput] = useState<string>("");
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
    const handleNext = async (filteredQuery?: string) => {
        // console.log("Input:", input);
        if (input.trim() === "" && !filteredQuery) {
            return;
        }
        const query = filteredQuery || input;
        setIsLoading(true);
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    role: 'user',
                    content: query
                }
            ]);
            // console.log("messages", messages);
            const response = await fetch('/api/get_properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: query, messages }),
            });
            // console.log("response", response);
            const responseData = await response.json();
            console.log("Response:", responseData);
            if (responseData.apiResponse.properties) {
                // console.log("responseData.apiResponse.properties and length", responseData.apiResponse.properties.length, responseData.apiResponse.properties[0]);
                setProperties(responseData.apiResponse.properties);
                // setMessages([]);
                setMessages((prevMessages) => [
                    ...prevMessages,
                    {
                        role: "assistant",
                        content: responseData.apiResponse.properties.length > 0 ? `${responseData.apiResponse.properties.length} are the properties that match your criteria:` : "No properties found that match your criteria."
                    }
                ]);
                if (responseData.apiResponse.api_call_parameters && responseData.apiResponse.api_call_parameters.length > 0) {
                    setApiCalParameters(responseData.apiResponse.api_call_parameters);
                }
                setInput("");
                return;
            }
            if (responseData.apiResponse.messages && responseData.apiResponse.messages.length > 0) {
                const lastMessage = responseData.apiResponse.messages[responseData.apiResponse.messages.length - 1];
                if (lastMessage.content) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            role: "assistant",
                            content: lastMessage.content
                        }
                    ]);
                }
            }
            setInput("");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const handleResize = () => {
            const isSmall = window.innerWidth < 768;
            setIsMobile(isSmall);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the correct state
        setLoadingPage(false);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleBuyOrRent = async (type: string) => {
        console.log("type", type);
        setIsLoading(true);
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    role: 'user',
                    content: type
                }
            ]);
            // console.log("messages", messages);
            const response = await fetch('/api/get_properties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: type, messages }),
            });
            // console.log("response", response);
            const responseData = await response.json();
            // console.log("Response:", responseData);
            if (responseData.apiResponse.properties) {
                setProperties(responseData.apiResponse.properties);
                return;
            }

            if (responseData.apiResponse.messages && responseData.apiResponse.messages.length > 0) {
                const lastMessage = responseData.apiResponse.messages[responseData.apiResponse.messages.length - 1];
                if (lastMessage.content) {
                    setMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            role: "assistant",
                            content: lastMessage.content
                        }
                    ]);
                }
            }
            setInput("");
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (!user) {
            return;
        }
        if (savedChatId) {
            handleSaveIntoExistingChat(savedChatId, messages, properties);
        } else {
            handleSaveChat(messages, setSavedChatId);
        }
    }, [messages, properties, user]);

    if (loadingPage) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
    }

    const handleSavedChatClick = async (id: string) => {
        if (!user) {
            return;
        }
        setLoadingPage(true);
        setSavedChatId(id);
        console.log("savedChatId", savedChatId);
        await handleLoadSavedChat(id, setMessages, setProperties);
        setLoadingPage(false);
    }
    return (
        <SidebarProvider defaultOpen={false} className="h-screen w-full">
            <AppSidebar handleSavedChatClick={handleSavedChatClick} />
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
                        <ResizablePanelGroup direction={hasProperties ? "vertical" : "horizontal"}>
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
                                            properties={properties}
                                            apiCalParameters={apiCalParameters}
                                            input={input} isLoading={isLoading}
                                            setInput={setInput}
                                        />
                                    </ResizablePanel>
                                </>
                            )}
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    {hasProperties && (
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
                {isMobile && <FloatingChatBar
                    messages={messages}
                    handleBuyOrRent={handleBuyOrRent}
                    handleNext={handleNext}
                    properties={properties}
                    apiCalParameters={apiCalParameters}

                />}
            </SidebarInset>
        </SidebarProvider>
    )
}

const handleSaveChat = async (messages: assessmentType[], setSavedChatId: (id: string) => void) => {
    console.log("messages", messages);
    if (messages.length === 0) {
        console.log("No messages provided");
        return;
    }
    try {
        const response = await fetch('/api/save_chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages }),
        });
        const responseData = await response.json();
        console.log("responseData from save chat", responseData);
        setSavedChatId(responseData[0].id);
    } catch (error) {
        console.error("Error saving chat:", error);
    }
}

const handleLoadSavedChat = async (id: string, setMessages: (messages: assessmentType[]) => void, setProperties: (properties: any[]) => void) => {
    try {
        if (!id) {
            console.error("No ID provided");
            return;
        }
        const response = await fetch(`/api/get_saved_chat_by_id?id=${id}`);
        const responseData = await response.json();
        console.log("responseData", responseData);
        if (responseData.length > 0) {
            const historyMessages = responseData[0].messages || [];
            const historyProperties = responseData[0].properties || [];
            setMessages(historyMessages);
            setProperties(historyProperties);
        }
    } catch (error) {
        console.error("Error loading saved chat:", error);
    }
}

const handleSaveIntoExistingChat = async (id: string, messages: assessmentType[], properties: any[]) => {
    console.log("messages", messages);
    console.log("properties", properties);
    if (messages.length === 0 && properties.length === 0) {
        console.log("No messages or properties provided");
        return;
    }
    try {
        const response = await fetch(`/api/save_into_existing_chat?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages, properties }),
        });
        const responseData = await response.json();
        console.log("responseData", responseData);
    } catch (error) {
        console.error("Error saving into existing chat:", error);
    }
}