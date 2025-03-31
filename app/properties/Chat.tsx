'use client'
import { useRef, useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ReactMarkdown from "react-markdown"
import { Input } from "@/components/ui/input"
import { SelectDemo } from "@/components/SelectGroup"
import { cn } from "@/lib/utils"
import React from "react"
export type assessmentType = {
    role: "user" | "assistant";
    content: string;
}
type ChatProps = {
    messages: assessmentType[],
    handleBuyOrRent: (type: string) => Promise<void>,
    handleNext: (input: string, filteredQuery?: string) => Promise<void>,
    isProperties: boolean,
    apiCalParameters: any[],
    isLoading: boolean
}
const Chat = (
    {
        messages,
        handleBuyOrRent,
        handleNext,
        isProperties,
        apiCalParameters,
        isLoading
    }: ChatProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [input, setInput] = useState<string>("");


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [messages]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleNext(input);
            setInput("");
        }
    };

    const handleSendClick = () => {
        handleNext(input);
        setInput("");
    };

    return (
        <div className="flex flex-col h-full items-center w-full gap-1 md:gap-2 p-2 border-t-2 border-green-500 rounded-xl">
            {/* <h2 className="text-xl font-bold leading-none">Enquire your properties here</h2> */}
            <ScrollArea ref={scrollRef} className="flex-1 w-full h-full rounded-md overflow-y-auto">
                <div className="p-4 flex flex-col items-center">
                    {messages.length === 0 && (
                        <>
                            <div className="flex justify-start w-full mb-2" >
                                <div className={cn(
                                    "rounded-xl px-4 py-2",
                                    `bg-[#000000]/10`
                                )}>
                                    <p className="text-sm font-medium text-muted-foreground mb-2 px-2">
                                        What purpose do you want to use this property for?
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center justify-end w-full gap-2">
                                <Button onClick={() => handleBuyOrRent("I want to buy a property")} variant="outline" className="font-medium">I want to buy</Button>
                                <Button onClick={() => handleBuyOrRent("I want to rent a property")} variant="outline" className="font-medium">I want to rent</Button>
                            </div>
                        </>
                    )}
                    {messages.map((msg, index) => (
                        <div className="mb-2 w-full max-w-[900px]" key={index}>
                            {msg.role === "user" && <div className="flex flex-col items-end w-full md:pr-2 lg:pr-6">
                                <Card className="p-0">
                                    <CardContent className="flex justify-center h-full px-4 py-2">
                                        <div className="text-sm max-w-[400px] min-w-[50px] text-center">{msg.content}</div>
                                    </CardContent>
                                </Card>
                            </div>}
                            {msg.role === "assistant" && <div className="p-2 rounded mt-2 max-w-[600px]">
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>}
                        </div>
                    ))}

                </div>
                {isProperties && apiCalParameters.length > 0 && <div className="max-w-[100%] p-2 flex justify-center items-center mb-2">
                    <SelectDemo apiCalParameters={apiCalParameters} handleNext={handleNext} />
                </div>}
            </ScrollArea>
            <div className="flex items-center justify-center w-[90%] gap-4 p-2 z-10 bg-white rounded-2xl">
                <Input value={input}
                    ref={inputRef}
                    onKeyDown={(e) => handleKeyDown(e)}
                    onChange={handleInputChange} disabled={messages.length === 0 || isLoading} placeholder="Type your message here." className="w-full" />
                <Button disabled={messages.length === 0 || isLoading} onClick={handleSendClick}>Send</Button>
            </div>
        </div>
    )
}
export default Chat;