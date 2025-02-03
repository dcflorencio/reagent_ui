"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRef, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
// import Loader from "@/components/DotLoader/Loader"
// import Markdown from 'react-markdown'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
// import { Loader } from "lucide-react"
// type queryType = {
//     role: string;
//     content: {
//         type: string;
//         text: string;
//     }[];
// }
type assessmentType = {
    role: "user" | "assistant";
    content: string;
}
export default function Assessment() {
    const [messages, setMessages] = useState<assessmentType[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
    const [assessment, setAssessment] = useState<assessmentType[]>([]);
    const [input, setInput] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [user, setUser] = useState<any>(null);
    const [isFileUploaded, setIsFileUploaded] = useState<boolean>(false);
    const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleNext = async () => {
        console.log("Input:", input);
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                role: 'user',
                content: input
            }
        ]);
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
    }
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // console.log("completedQuestions:", completedQuestions);
    return (
        <div className="flex flex-col h-[calc(100vh-64px)] items-center mt-12 w-full gap-1 md:gap-2">
            <h2 className="mb-2 md:mb-4 text-2xl font-bold leading-none">Welcome to the Chatbot</h2>
            <ScrollArea ref={scrollRef} className="h-full w-[90%] rounded-md border overflow-auto">
                <div className="p-4 flex flex-col items-center">
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
            <div className="flex items-center justify-center w-[90%] md:w-[75%] gap-4 p-2">
                <Input value={input}
                    disabled={isLoading || isFileUploaded}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleNext();
                        }
                    }} onChange={(e) => setInput(e.target.value)} placeholder="Type your message here." className="w-full md:w-[75%] lg:w-[50%]" />
                <Button disabled={isLoading} onClick={handleNext}>Send</Button>
            </div>
        </div>
    )
}
