"use client"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { SidebarProvider } from "@/components/ui/sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "../properties/components/app-sidebar"
import MenubarDemo from "@/components/Menubar"
import PropertyMap from "@/components/PropertyMap"
import { testProperties } from "../properties/demoProperties"
import ChatBar from "./Chat"
import PropertyCard from "@/components/PropertyCard"
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

export default function Page() {
    // const [properties, setProperties] = useState(testProperties);
    const [loadingPage, setLoadingPage] = useState<boolean>(true);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [messages, setMessages] = useState<assessmentType[]>([]);
    const [input, setInput] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [properties, setProperties] = useState<any[]>(testProperties);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiCalParameters, setApiCalParameters] = useState<any[]>([]);
    const hasProperties = properties.length > 0;

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

    if (loadingPage) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
    }

    return (
        <SidebarProvider defaultOpen={false} className="h-screen w-full">
            <AppSidebar />
            <SidebarInset>
                <MenubarDemo />
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
                    setMessages={setMessages}
                    handleBuyOrRent={handleBuyOrRent}
                    handleNext={handleNext}
                    properties={properties}
                    apiCalParameters={apiCalParameters}

                />}
            </SidebarInset>
        </SidebarProvider>
    )
}
