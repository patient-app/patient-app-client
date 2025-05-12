"use client";

import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    {/* Navigation is not shown at these sites:*/}
    const noNavigationPages = ["/terms", "/login", "/register"];
    if (noNavigationPages.includes(pathname)) return null;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isMobile, setIsMobile] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 725);
        };
        handleResize(); // initialize
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push("/login");
    };

    if (isMobile) {
        return (
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
                <button onClick={() => router.push("/chat")} className="flex-1 text-center">
                    Chatbot
                </button>
                <button onClick={() => router.push("/settings")} className="flex-1 text-center">
                    Settings
                </button>
                <button onClick={logout} className="flex-1 text-center text-red-500">
                    Log out
                </button>
            </footer>
        );
    }

    return (
        <aside className="h-screen w-64 bg-[#F9F9F9] p-4 pt-20 pl-7">
            <nav className="flex flex-col gap-2">
                <a href="/chat" className="text-black font-[500] hover:text-emerald-600 hover:bg-[#f0f0f0] rounded-md px-2 py-1">Chatbot</a>
                <a href="/settings" className="text-black font-[500] hover:text-emerald-600 hover:bg-[#f0f0f0] rounded-md px-2 py-1">Settings</a>
                <button
                    onClick={logout}
                    className="text-left text-black font-[500] hover:text-red-500 hover:bg-[#f0f0f0] cursor-pointer rounded-md px-2 py-1">
                    Log out
                </button>
            </nav>
        </aside>
    );
}