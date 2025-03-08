import {
    Menubar
} from "@/components/ui/menubar"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/utils/supabase/client"
import { ProfileDropdown } from "./ProfileDropdown"
import { User } from "@supabase/supabase-js"
const MenubarDemo = () => {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();
    const handleLogin = async () => {
        router.push('/login')
    };
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setIsLoggedIn(!!user);
            setUser(user);
        };
        checkUser();
    }, [supabase]);
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setIsLoggedIn(false);
            router.push('/login');
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <div className="">
            {/* Logo on the left */}
            <Menubar className="flex justify-center px-4 rounded-none">
                <div className="flex items-center justify-between w-full">
                    <div className="flex-shrink-0">
                        {/* <img src="/logo.JPG" alt="Logo" className="h-7 rounded-full w-7" /> */}
                        <h1 className="text-xl font-medium">Reagent UI</h1>
                    </div>
                    {/* <div className="flex-grow flex flex-row justify-center gap-10"> */}
                    {/* <MenubarMenu>
                        <MenubarTrigger>File</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem>
                                New Window <MenubarShortcut>⌘N</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem disabled>New Incognito Window</MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Share</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>Email link</MenubarItem>
                                    <MenubarItem>Messages</MenubarItem>
                                    <MenubarItem>Notes</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem>
                                Print... <MenubarShortcut>⌘P</MenubarShortcut>
                            </MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Edit</MenubarTrigger>
                        <MenubarContent>
                            <MenubarItem>
                                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem>
                                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarSub>
                                <MenubarSubTrigger>Find</MenubarSubTrigger>
                                <MenubarSubContent>
                                    <MenubarItem>Search the web</MenubarItem>
                                    <MenubarSeparator />
                                    <MenubarItem>Find...</MenubarItem>
                                    <MenubarItem>Find Next</MenubarItem>
                                    <MenubarItem>Find Previous</MenubarItem>
                                </MenubarSubContent>
                            </MenubarSub>
                            <MenubarSeparator />
                            <MenubarItem>Cut</MenubarItem>
                            <MenubarItem>Copy</MenubarItem>
                            <MenubarItem>Paste</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>View</MenubarTrigger>
                        <MenubarContent>
                            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
                            <MenubarCheckboxItem checked>
                                Always Show Full URLs
                            </MenubarCheckboxItem>
                            <MenubarSeparator />
                            <MenubarItem inset>
                                Reload <MenubarShortcut>⌘R</MenubarShortcut>
                            </MenubarItem>
                            <MenubarItem disabled inset>
                                Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                            </MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Hide Sidebar</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                    <MenubarMenu>
                        <MenubarTrigger>Profiles</MenubarTrigger>
                        <MenubarContent>
                            <MenubarRadioGroup value="benoit">
                                <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                                <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                                <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                            </MenubarRadioGroup>
                            <MenubarSeparator />
                            <MenubarItem inset>Edit...</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem inset>Add Profile...</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu> */}

                    {/* </div> */}
                </div>
                {/* Login/Logout button on the right */}
                <div className="flex-shrink-0">
                    {/* <Button className="px-4 rounded h-7" onClick={isLoggedIn ? handleLogout : handleLogin}>
                        {isLoggedIn ? 'Logout' : 'Login'}
                    </Button> */}
                    {isLoggedIn && user ? <ProfileDropdown handleLogout={handleLogout} user={user} /> : <Button className="px-4 rounded h-7" onClick={handleLogin}>
                        Login
                    </Button>}
                </div>
            </Menubar>
        </div>

    )
}

export default MenubarDemo;