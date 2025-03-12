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
import ChatBar from "../properties/Chat"
import PropertyCard from "../properties/components/PropertyCardWithSavedFeature"
import { ScrollArea } from "@/components/ui/scroll-area"
import FloatingChatBar from "@/components/FloatingChatbar"
import { useState, useEffect, useRef } from "react"
import React from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PropertyCardSkeleton } from "@/components/PropertyCardSkeleton"
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
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiCalParameters, setApiCalParameters] = useState<any[]>([]);
    const [hasSavedProperties, setHasSavedProperties] = useState<boolean>(false);
    const [isFetchingSavedProperties, setIsFetchingSavedProperties] = useState<boolean>(false);
    const hasProperties = properties.length > 0;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        fetchSavedProperties();

    }, []);

    useEffect(() => {
        const handleResize = () => {
            const isSmall = window.innerWidth < 768;
            setIsMobile(isSmall);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the correct state
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchSavedProperties = async () => {
        setIsFetchingSavedProperties(true);
        try {
            const response = await fetch('/api/get_saved_properties');
            const data = await response.json();
            console.log("saved properties data:", data);
            const properties = data.map((property: any) => property.property);
            setProperties(properties);
            if (properties.length > 0) {
                setHasSavedProperties(true);
            } else {
                setHasSavedProperties(false);
            }
        } catch (error) {
            console.error("Error fetching saved properties:", error);
        } finally {
            setLoadingPage(false);
            setIsFetchingSavedProperties(false);
        }
    };
    // const handleBuyOrRent = async (type: string) => {
    //     console.log("type", type);
    //     setIsLoading(true);
    //     try {
    //         setMessages((prevMessages) => [
    //             ...prevMessages,
    //             {
    //                 role: 'user',
    //                 content: type
    //             }
    //         ]);
    //         // console.log("messages", messages);
    //         const response = await fetch('/api/get_properties', {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify({ input: type, messages }),
    //         });
    //         // console.log("response", response);
    //         const responseData = await response.json();
    //         // console.log("Response:", responseData);
    //         if (responseData.apiResponse.properties) {
    //             setProperties(responseData.apiResponse.properties);
    //             return;
    //         }

    //         if (responseData.apiResponse.messages && responseData.apiResponse.messages.length > 0) {
    //             const lastMessage = responseData.apiResponse.messages[responseData.apiResponse.messages.length - 1];
    //             if (lastMessage.content) {
    //                 setMessages((prevMessages) => [
    //                     ...prevMessages,
    //                     {
    //                         role: "assistant",
    //                         content: lastMessage.content
    //                     }
    //                 ]);
    //             }
    //         }
    //         setInput("");
    //     } catch (error) {
    //         console.error("Error:", error);
    //     } finally {
    //         setIsLoading(false);
    //     }
    // }

    if (loadingPage) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
    }
    if (!hasSavedProperties) {
        return <div className="flex justify-center items-center h-screen flex-col gap-4"> <span className="text-2xl font-bold">No saved properties</span>
            <Link href="/properties">
                <Button className="bg-green-500 text-white hover:bg-green-600 cursor-pointer">
                    Go to properties
                </Button>
            </Link>
        </div>;
    }
    return (
        <SidebarProvider defaultOpen={false} className="h-screen w-full">
            <AppSidebar />
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
                            {/* {!isMobile && (
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
                            )} */}
                        </ResizablePanelGroup>
                    </ResizablePanel>
                    {hasProperties && (
                        <>
                            <ResizableHandle />
                            <ResizablePanel defaultSize={50}>
                                <ScrollArea className="h-full rounded-xl border-t-2 border-green-500">
                                    {isFetchingSavedProperties ? (
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                                            <PropertyCardSkeleton />
                                            <PropertyCardSkeleton />
                                            <PropertyCardSkeleton />
                                            <PropertyCardSkeleton />
                                        </div>
                                    ) : (
                                        <PropertyCard properties={properties} reloadMethod={fetchSavedProperties} />
                                    )}
                                </ScrollArea>
                            </ResizablePanel>
                        </>
                    )}
                </ResizablePanelGroup>
                {/* {isMobile && <FloatingChatBar
                    messages={messages}
                    handleBuyOrRent={handleBuyOrRent}
                    handleNext={handleNext}
                    properties={properties}
                    apiCalParameters={apiCalParameters}

                />} */}
            </SidebarInset>
        </SidebarProvider>
    )
}


