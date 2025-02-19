'use client'
import { assessmentType } from "../properties/page"
import { useRef, useEffect, lazy } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
const ReactMarkdown = lazy(() => import('react-markdown'))
import { Input } from "@/components/ui/input"
import { SelectDemo } from "@/components/SelectGroup"
import { cn } from "@/lib/utils"
import React from "react"

const Chat = ({ messages, handleBuyOrRent, handleNext, properties, apiCalParameters, input, isLoading, setInput }: { messages: assessmentType[], handleBuyOrRent: (type: string) => Promise<void>, handleNext: (filteredQuery?: string) => Promise<void>, properties: any[], apiCalParameters: any[], input: string, isLoading: boolean, setInput: (input: string) => void }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);
    return (
        <div className="flex flex-col h-full items-center w-full gap-1 md:gap-2 p-2 border-t-2 border-green-500 rounded-xl">
            {/* <h2 className="text-xl font-bold leading-none">Enquire your properties here</h2> */}
            <ScrollArea ref={scrollRef} className="flex-1 w-full h-full rounded-md overflow-y-auto">
                <div className="p-4 flex flex-col items-center">
                    {messages.length === 0 && (
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
                    )}
                    {messages.length === 0 &&
                        <div className="flex flex-row items-center justify-end w-full gap-2">
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
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            </div>}
                        </div>
                    ))}

                </div>
                {properties.length > 0 && apiCalParameters.length > 0 && <div className="max-w-[100%] p-2 flex justify-center items-center mb-10">
                    <SelectDemo apiCalParameters={apiCalParameters} handleNext={handleNext} />
                </div>}
            </ScrollArea>
            <div className="flex items-center justify-center w-[90%] gap-4 p-2 z-10 bg-white rounded-2xl">
                <Input value={input}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleNext();
                        }
                    }} onChange={(e) => setInput(e.target.value)} disabled={messages.length === 0 || isLoading} placeholder="Type your message here." className="w-full" />
                <Button disabled={messages.length === 0 || isLoading} onClick={() => handleNext()}>Send</Button>
            </div>
        </div>
    )
}
export default Chat;