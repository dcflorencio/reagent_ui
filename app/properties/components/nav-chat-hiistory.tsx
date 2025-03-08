"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useEffect } from "react"
import { useState } from "react"

export function NavChatHistory({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const [savedChats, setSavedChats] = useState<any[]>([]);
  useEffect(() => {
    const fetchSavedChats = async () => {
      try {
        const response = await fetch('/api/get_saved_chat');
        const data = await response.json();
        console.log("data", data);
        setSavedChats(data);
      } catch (error) {
        console.error("Error fetching saved chats:", error);
      }
    };
    fetchSavedChats();
  }, []);

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Properties</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {/* {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))} */}
                  {savedChats.map((chat, index) => (
                    <SidebarMenuSubItem key={chat.created_at}>
                      <SidebarMenuSubButton asChild>
                        <a href={`/properties/chat/${chat.id}`}>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{chat.messages[0].content.slice(0, 10)}...</span>
                            <span className="text-xs text-gray-500">{chat.created_at}</span>
                          </div>
                        </a>  
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
