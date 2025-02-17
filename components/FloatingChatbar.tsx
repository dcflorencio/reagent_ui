"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Bot, X, ChevronUp, Send, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant" | "error";
  content: string;
}

export const FloatingChatBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Welcome to Property Finder! How can I assist you with finding properties today?",
    },
  ]);
  const [properties, setProperties] = useState<any[]>([]);
  const [apiCalParameters, setApiCalParameters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const brandColor = "#000000";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        if (!inputValue) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!isExpanded && e.target.value) {
      setIsExpanded(true);
    }
  };

  const handleClose = () => {
    setIsExpanded(false);
    setInputValue("");
  };

  const handleBarClick = () => {
    setIsExpanded(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      
      role: "user",
      content: message.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/get_properties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: message.trim(), messages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      if (data.apiResponse.properties) {
        setProperties(data.apiResponse.properties);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "assistant",
            content: data.apiResponse.properties.length > 0 ? `${data.apiResponse.properties.length} properties found.` : "No properties found.",
          },
        ]);
        if (data.apiResponse.api_call_parameters) {
          setApiCalParameters(data.apiResponse.api_call_parameters);
        }
      } else {
        const aiMessage: Message = {
          
          role: "assistant",
          content: data.response,
        };
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "error",
        content: "Sorry, I experienced an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    await sendMessage(inputValue);
  };

  const MessageContent = ({ message }: { message: Message }) => (
    <div className="space-y-2">
      <div className="prose prose-sm">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>
      {message.citations && message.citations.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs font-medium text-muted-foreground mb-2">Sources:</p>
          <div className="space-y-2">
            {message.citations.map((citation, index) => (
              <div key={index} className="text-xs">
                <p className="flex items-center gap-2">
                  <span className="font-medium">[{index + 1}]</span>
                  <a
                    href={citation.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {citation.fileName || "Source Document"}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </p>
                {citation.fileCitation && (
                  <blockquote className="mt-1.5 pl-3 border-l-2 border-muted-foreground/30 text-muted-foreground">
                    {citation.fileCitation}
                  </blockquote>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MessageList = () => (
    <div className="space-y-4 mb-4 pt-2">
      {messages.map((message) => (
        <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
          <div
            className={cn(
              "max-w-[80%] rounded-xl px-4 py-3",
              message.role === "user" && "bg-accent text-foreground",
              message.role === "assistant" && `bg-[${brandColor}]/10`,
              message.role === "error" && "bg-destructive/10 text-destructive"
            )}
          >
            <MessageContent message={message} />
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className={cn(
            "rounded-xl px-4 py-3",
            `bg-[${brandColor}]/10`
          )}>
            <Loader2 className="h-5 w-5 animate-spin" style={{ color: brandColor }} />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center items-end pb-8 z-50 pointer-events-none px-4">
        <motion.div
          ref={chatRef}
          initial={false}
          animate={{
            height: isExpanded ? "80vh" : "80px",
            width: isExpanded ? "1000px" : "700px",
          }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 320,
          }}
          className={cn(
            "bg-white rounded-2xl pointer-events-auto overflow-hidden",
            isExpanded
              ? "shadow-[0_0_80px_-15px_rgba(0,0,0,0.4),0_0_0_1px_rgba(0,0,0,0.05),0_0_60px_0_rgba(0,124,255,0.15)]"
              : [
                "shadow-[0_0_60px_-15px_rgba(255,0,0,0.2),0_0_80px_-20px_rgba(255,166,0,0.2),0_0_100px_-25px_rgba(0,128,0,0.2),0_0_120px_-30px_rgba(0,0,255,0.2)]",
                "before:absolute before:inset-0 before:-z-10",
                "before:bg-[radial-gradient(circle_at_50%_120%,rgba(255,0,0,0.15),rgba(255,166,0,0.15),rgba(0,128,0,0.15),rgba(0,0,255,0.15),rgba(238,130,238,0.15))]",
                "before:blur-xl before:opacity-50",
                "before:animate-pulse",
                "after:absolute after:inset-0 after:-z-20",
                "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),rgba(255,166,0,0.1),rgba(0,128,0,0.1),rgba(0,0,255,0.1),rgba(238,130,238,0.1))]",
                "after:blur-2xl after:opacity-40",
                "after:animate-pulse",
                "hover:scale-[1.02]"
              ].join(" "),
            "transition-all duration-500 ease-in-out flex flex-col",
            "relative isolate"
          )}
        >
          {/* Chat Header */}
          <div
            className={cn(
              "px-8 py-5 flex items-center justify-between shrink-0",
              !isExpanded && "hover:bg-accent/50 rounded-2xl transition-colors cursor-pointer group"
            )}
            onClick={!isExpanded ? handleBarClick : undefined}
            style={{
              borderBottom: isExpanded ? `1px solid ${brandColor}20` : "none",
              background: !isExpanded ? `linear-gradient(to right, ${brandColor}08, ${brandColor}15)` : 'white'
            }}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "h-12 w-12 rounded-xl flex items-center justify-center transition-transform duration-300",
                )}
                style={{
                  backgroundColor: `${brandColor}20`,
                  color: brandColor,
                }}
              >
                <Bot className="h-7 w-7" />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-xl tracking-tight" style={{ color: brandColor }}>
                  Property Finder
                </span>
                {/* <span className="text-sm text-muted-foreground font-medium"></span> */}
              </div>
            </div>
            <div className="flex items-center gap-3">
              
              {!isExpanded ? (
                <ChevronUp className="h-6 w-6 text-muted-foreground animate-bounce group-hover:text-foreground transition-colors" />
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClose();
                  }}
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Chat Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-0 flex flex-col"
              >
                {/* Messages Area */}
                <ScrollArea className="flex-1 px-8">
                  <MessageList />
                </ScrollArea>

                {/* Predefined Queries */}
                {messages.length === 1 && (
                  <div
                    className="p-6 border-t shrink-0"
                    style={{
                      backgroundColor: `${brandColor}05`,
                      borderColor: `${brandColor}15`,
                    }}
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-4 px-2">
                      How can I help you today?
                    </p>
                    
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
            className={cn(
              "px-8 py-5 shrink-0",
              isExpanded ? "border-t" : "",
              !isExpanded && "pb-6"
            )}
            style={{ borderColor: `${brandColor}15` }}
          >
            <div className="relative flex items-center gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder={isExpanded ? "Type your message..." : `Ask Property Finder AI anything...`}
                className={cn(
                  "flex-1 py-6 pr-14 text-base rounded-xl",
                  "transition-all duration-200",
                  "focus:ring-2 focus:ring-offset-0 focus:outline-none",
                  !isExpanded && "bg-accent/50 hover:bg-accent group-hover:bg-accent"
                )}
                style={{
                  borderColor: `${brandColor}30`,
                  '--tw-ring-color': brandColor
                } as any} onFocus={() => !isExpanded && setIsExpanded(true)}
              />
              <Button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "absolute right-2.5 h-10 w-10 rounded-lg",
                  "text-primary-foreground",
                  "transition-all duration-200",
                  "hover:opacity-90 hover:scale-105"
                )}
                style={{ backgroundColor: brandColor }}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            {!isExpanded && (
              <p className="text-xs text-muted-foreground mt-2 px-1">
                Press Enter to start a new conversation
              </p>
            )}
          </form>
        </motion.div>
      </div>

      {/* Scrollbar Styles */}
      <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
    </>
  );
};

export default FloatingChatBar;