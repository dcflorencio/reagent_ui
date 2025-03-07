"use client"

import * as React from "react"
import { NavMain } from "./nav-main"
// import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
// import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarTrigger,
} from "@/components/ui/sidebar"

// Dynamic imports for lucide-react icons
const AudioWaveform = React.lazy(() => import("lucide-react").then(module => ({ default: module.AudioWaveform })));
// const BookOpen = React.lazy(() => import("lucide-react").then(module => ({ default: module.BookOpen })));
// const Bot = React.lazy(() => import("lucide-react").then(module => ({ default: module.Bot })));
const Command = React.lazy(() => import("lucide-react").then(module => ({ default: module.Command })));
const Frame = React.lazy(() => import("lucide-react").then(module => ({ default: module.Frame })));
const GalleryVerticalEnd = React.lazy(() => import("lucide-react").then(module => ({ default: module.GalleryVerticalEnd })));
const Map = React.lazy(() => import("lucide-react").then(module => ({ default: module.Map })));
const PieChart = React.lazy(() => import("lucide-react").then(module => ({ default: module.PieChart })));
const SaveIcon = React.lazy(() => import("lucide-react").then(module => ({ default: module.SaveIcon })));
// const Settings2 = React.lazy(() => import("lucide-react").then(module => ({ default: module.Settings2 })));
// const SquareTerminal = React.lazy(() => import("lucide-react").then(module => ({ default: module.SquareTerminal })));

// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Saved Properties",
            url: "#",
            icon: SaveIcon,
            isActive: true,
            items: [
                {
                    title: "View all",
                    url: "/saved-properties",
                },
                {
                    title: "Delete all",
                    url: "#",
                },
            ],
        }
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarTrigger/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                {/* <NavProjects projects={data.projects} /> */}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
