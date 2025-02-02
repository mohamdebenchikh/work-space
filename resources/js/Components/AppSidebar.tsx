import { Calendar, ChevronsUpDown, ContactIcon, Folder, Home, FileText, LayoutDashboard, LogOutIcon, Search, Settings, User2Icon, ListCheck } from "lucide-react";
import ApplicationLogo from "./ApplicationLogo";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "./ui/dropdown-menu";
import { Link, usePage } from "@inertiajs/react";


export function AppSidebar() {

    const { isMobile } = useSidebar();
    const { user } = usePage().props.auth;

    // Menu items.
    const items = [
        {
            title: "Dashboard",
            url: route('dashboard'),
            icon: LayoutDashboard,
            isActive: route().current('dashboard'),
        },
        {
            title: "Teams",
            url: route('teams.index'),
            icon: ContactIcon,
            isActive: route().current('teams.*'),
        },
        {
            title: "Projects",
            url: route('projects.index'),
            icon: Folder,
            isActive: route().current('projects.*'),
        },
        {
            title: "Pages",
            url: route('pages.index'),
            icon: FileText,
            isActive: route().current('pages.*'),
        },
        {
            title: "Tasks",
            url: route('tasks.index'),
            icon: ListCheck,
            isActive: route().current('tasks.*'),
        },
        {
            title: "Search",
            url: "#",
            icon: Search,
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings,
        },
    ]


    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center gap-2">
                        <SidebarMenuButton size={'lg'}>
                            <Avatar className="rounded-lg size-8">
                                <AvatarFallback className="rounded-lg dark:bg-zinc-200 dark:text-zinc-800 bg-zinc-200 text-zinc-800">
                                    <ApplicationLogo className="fill-current size-6" />
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col leading-tight">
                                <h3 className="font-semibold">Project Manager</h3>
                                <span className="text-xs text-muted-foreground">Laravel & Inertia</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild isActive={item.isActive ?? false}>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>

                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={user.photo_url} alt={user.name} />
                                        <AvatarFallback className="rounded-lg">
                                            {user.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs">{user.email}</span>
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side={isMobile ? "bottom" : "right"}
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={user.photo_url} alt={user.name} />
                                            <AvatarFallback className="rounded-lg">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href={route('profile.edit')}>
                                        <User2Icon /> Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link as="button" className="w-full" href={route('logout')} method="post">
                                        <LogOutIcon /> Logout
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}