"use client"
import { AppSidebar } from "./components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import PropertyCard from "@/components/PropertyCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import PropertyMap from "@/components/PropertyMap"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import React, { lazy } from "react"
import { SelectDemo } from "@/components/SelectGroup"
import { MenubarDemo } from "@/components/Menubar"
import { testProperties } from './demoProperties'
import { FloatingChatBar } from "@/components/FloatingChatbar"
export type assessmentType = {
    role: "user" | "assistant";
    content: string;
}

const Markdown = lazy(() => import('react-markdown'))
export default function Page() {
    const [messages, setMessages] = useState<assessmentType[]>([]);
    const [input, setInput] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [properties, setProperties] = useState<any[]>(testProperties);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [apiCalParameters, setApiCalParameters] = useState<any[]>([]);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

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
            setIsSmallScreen(window.innerWidth < 768); // 768px is the typical breakpoint for 'md'
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it initially to set the correct state

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
    return (

        <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <SidebarInset>
                <MenubarDemo />
                <div className="flex flex-1 flex-col md:flex-row gap-4 h-full max-h-[calc(100vh-60px)]">
                    <div className={`flex flex-col gap-2 ${properties.length === 0 ? 'md:flex-row md:w-full' : 'md:w-1/2'} px-4 pt-1`}>
                        <div className={`rounded-xl bg-muted/50 ${properties.length === 0 ? 'md:w-1/2 h-full' : 'h-[50%] md:h-[50%] h-[70%]'}`}>
                            <PropertyMap properties={properties} />
                        </div>
                        {!isSmallScreen && (
                            <ChatBar messages={messages} handleBuyOrRent={handleBuyOrRent} handleNext={handleNext} properties={properties} apiCalParameters={apiCalParameters} input={input} isLoading={isLoading} setInput={setInput} />
                        )}
                    </div>
                    {properties.length > 0 && <div className="flex-1 rounded-xl bg-muted/50 md:w-1/2 max-h-[calc(100vh-60px)] h-full" >
                        <ScrollArea className="h-full">
                            <PropertyCard properties={properties} />
                        </ScrollArea>
                    </div>}
                    {isSmallScreen && (
                        <FloatingChatBar
                            messages={messages}
                            setMessages={setMessages}
                            handleBuyOrRent={handleBuyOrRent}
                            handleNext={handleNext}
                            properties={properties}
                            apiCalParameters={apiCalParameters}
                        />
                    )}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
export const ChatBar = ({ messages, handleBuyOrRent, handleNext, properties, apiCalParameters, input, isLoading, setInput }: { messages: assessmentType[], handleBuyOrRent: (type: string) => Promise<void>, handleNext: (filteredQuery?: string) => Promise<void>, properties: any[], apiCalParameters: any[], input: string, isLoading: boolean, setInput: (input: string) => void }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className={`aspect-video rounded-xl bg-muted/50 ${properties.length === 0 ? 'md:w-1/2 h-full' : 'h-[50%]'} md:h-[50%] h-[70%] border-t-2 border-green-500`}>
            <div className="flex flex-col h-full items-center mt-4 w-full gap-1 md:gap-2">
                <h2 className="text-xl font-bold leading-none">Enquire your properties here</h2>
                <ScrollArea ref={scrollRef} className="flex-1 w-full h-full rounded-md overflow-y-auto">
                    <div className="p-4 flex flex-col items-center pb-10">
                        {messages.length === 0 &&
                            <div className="flex flex-row items-center justify-center w-full gap-2">
                                <Button onClick={() => handleBuyOrRent("I want to buy a property")} variant="outline" className="font-medium">I want to buy</Button>
                                <Button onClick={() => handleBuyOrRent("I want to rent a property")} variant="outline" className="font-medium">I want to rent</Button>
                            </div>
                        }
                        {messages.map((msg, index) => (
                            <div className="mb-2 w-full max-w-[900px]" key={index}>
                                {msg.role === "user" && <div className="flex flex-col items-end w-full md:pr-2 lg:pr-6">
                                    <Card >
                                        <CardContent className="flex justify-center h-full p-2">
                                            <div className="text-sm max-w-[400px] min-w-[50px] text-center">{msg.content}</div>
                                        </CardContent>
                                    </Card>
                                </div>}
                                {msg.role === "assistant" && <div className="p-2 rounded mt-2 max-w-[600px]">
                                    <Markdown>{msg.content}</Markdown>
                                </div>}
                            </div>
                        ))}
                    </div>
                    {properties.length > 0 && apiCalParameters.length > 0 && <div className="max-w-[100%] p-2 flex justify-center items-center mb-10">
                        <SelectDemo apiCalParameters={apiCalParameters} handleNext={handleNext} />
                    </div>}
                </ScrollArea>
                <div className="flex items-center justify-center w-[90%] gap-4 p-2 -mt-10 z-10 bg-white rounded-2xl">
                    <Input value={input}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleNext();
                            }
                        }} onChange={(e) => setInput(e.target.value)} disabled={messages.length === 0 || isLoading} placeholder="Type your message here." className="w-full" />
                    <Button disabled={messages.length === 0 || isLoading} onClick={() => handleNext()}>Send</Button>
                </div>
            </div>
        </div>
    )
}