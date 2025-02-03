"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PropertyCard from "@/components/PropertyCard"
import PropertyMap from "@/components/PropertyMap"

type assessmentType = {
    role: "user" | "assistant";
    content: string;
}

export default function FindProperties() {
    const [messages, setMessages] = useState<assessmentType[]>([]);
    const [input, setInput] = useState<string>("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [properties, setProperties] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const handleNext = async () => {
        console.log("Input:", input);
        if(input.trim() === "") {
            return;
        }
        setIsLoading(true);
        try {
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    role: 'user',
                    content: input
                }
            ]);
            console.log("messages", messages);
            const response = await fetch('/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input, messages }),
            });
            console.log("response", response);
            const responseData = await response.json();
            console.log("Response:", responseData);
            if (responseData.apiResponse.properties) {
                setProperties(responseData.apiResponse.properties);
                // setMessages([]);
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
            console.log("messages", messages);
            const response = await fetch('/api/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input: type, messages }),
            });
            console.log("response", response);
            const responseData = await response.json();
            console.log("Response:", responseData);
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
        <div className="grid grid-cols-2 h-screen">
            {/* Left Column */}
            <div className="flex flex-col gap-1 col-span-1">
                {/* Map Section */}
                <div className="h-[50%]">
                    <PropertyMap properties={properties} />
                </div>
                {/* Chatbot Section */}
                <div className="h-[50%]">
                    <div className="flex flex-col h-full items-center mt-4 w-full gap-1 md:gap-2">
                        <h2 className="text-xl font-bold leading-none">Enquire your properties here</h2>
                        <ScrollArea ref={scrollRef} className="flex-1 w-full rounded-md border overflow-auto">
                            <div className="p-4 flex flex-col items-center">
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
                                            <div>{msg.content}</div>
                                        </div>}
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="flex items-center justify-center w-[90%] gap-4 p-2">
                            <Input value={input}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleNext();
                                    }
                                }} onChange={(e) => setInput(e.target.value)} disabled={messages.length === 0 || isLoading} placeholder="Type your message here." className="w-full" />
                            <Button disabled={messages.length === 0 || isLoading} onClick={handleNext}>Send</Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Right Column */}
            <div className="col-span-1 overflow-auto">
                <PropertyCard properties={properties} />
            </div>
        </div>
    )
}
