"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bookmark, GalleryVerticalEnd, Search } from "lucide-react"
import { createClient } from "@/app/utils/supabase/client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function AppSidebar({ handleSavedChatClick, handleNewChatClick }: { handleSavedChatClick?: (id: string) => void, handleNewChatClick?: () => void }) {
    const pathname = usePathname()
    const [loading, setLoading] = useState(true);
    const [savedChats, setSavedChats] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();
    useEffect(() => {
        const fetchSavedChats = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    return;
                }
                setUser(user);
                const response = await fetch('/api/get_saved_chat');
                const data = await response.json();
                console.log("data", data);
                setSavedChats(data);
            } catch (error) {
                console.error("Error fetching saved chats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSavedChats();
    }, []);
    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    <GalleryVerticalEnd className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Reagent UI</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {/* <form>
                    <SidebarGroup className="py-0">
                        <SidebarGroupContent className="relative">
                            <Label htmlFor="search" className="sr-only">
                                Search
                            </Label>
                            <Input id="search" placeholder="Search the docs..." className="pl-8" />
                            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
                        </SidebarGroupContent>
                    </SidebarGroup>
                </form> */}
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Button variant="outline" className="w-full text-left cursor-pointer hover:bg-gray-200" onClick={() => handleNewChatClick && handleNewChatClick()}>
                                        Create New Chat
                                    </Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname === "/saved-properties"} 
                                    className={pathname === "/saved-properties" ? "bg-highlight text-highlight-foreground" : ""}
                                    disabled={pathname === "/saved-properties"}
                                >
                                    <Link href="/saved-properties">
                                        <Bookmark className="mr-2 h-4 w-4" />
                                        View all Saved Properties
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton 
                                    asChild 
                                    isActive={pathname === "/properties"} 
                                    className={pathname === "/properties" ? "bg-highlight text-highlight-foreground" : ""}
                                    disabled={pathname === "/properties"}
                                >
                                    <Link href="/properties">
                                        <Search className="mr-2 h-4 w-4" />
                                        Search Properties
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Chat History</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {loading && <div>Loading...</div>}
                            {!loading && user && savedChats.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>

                                        <Button variant="ghost" onClick={() => handleSavedChatClick && handleSavedChatClick(item.id)} className="w-full justify-start p-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-muted-foreground justify-end">
                                                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString()}
                                                </span>
                                                <span className="text-sm font-medium">{item.messages[0].content}</span>
                                            </div>
                                        </Button>


                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                            {!loading && !user && <SidebarMenuItem >Please login to view your saved chats</SidebarMenuItem>}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}



