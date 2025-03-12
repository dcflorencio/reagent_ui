import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AvatarFallback, Avatar, AvatarImage } from "./ui/avatar"
import { User } from "@supabase/supabase-js"
import { Bell } from "lucide-react";
import { Sparkles } from "lucide-react";
import { BadgeCheck } from "lucide-react";
import { CreditCard } from "lucide-react";
import { LogOut } from "lucide-react";

export function ProfileDropdown({ handleLogout, user }: { handleLogout: () => void, user: User }) {
    const avatarUrl = user?.user_metadata.avatar_url;
    const name = user?.user_metadata.name;
    const email = user?.email;
    console.log

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {/* <Button variant="outline" className="rounded-full"> */}
                <Avatar>
                    <AvatarImage src={avatarUrl} alt="U" />
                    <AvatarFallback>{name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                {/* </Button> */}
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent className="w-72">
                <DropdownMenuLabel>{name}</DropdownMenuLabel>
                <DropdownMenuLabel className="text-sm text-gray-500">{email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Saved Properties
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        Saved Searches
                        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent> */}
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback className="rounded-lg">{name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">{name}</span>
                            <span className="truncate text-xs">{email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    {/* <DropdownMenuItem>
                        <BadgeCheck />
                        Saved Properties
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <CreditCard />
                        Saved Searches
                    </DropdownMenuItem> */}
                    <DropdownMenuItem>
                        <Bell />
                        Notifications
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
