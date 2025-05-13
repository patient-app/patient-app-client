"use client";

import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import Link from "next/link";

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
            <footer className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3 px-2 z-50 h-20">
                <button onClick={() => router.push("/")} className="flex-1 flex flex-col items-center justify-center gap-1" aria-label="Home">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span className="text-xs font-medium">Home</span>
                </button>
                <button onClick={() => router.push("/chat")} className="flex-1 flex flex-col items-center justify-center gap-1" aria-label="Chatbot">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span className="text-xs font-medium">Chatbot</span>
                </button>
                <button onClick={() => router.push("/settings")} className="flex-1 flex flex-col items-center justify-center gap-1" aria-label="Settings">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                    <span className="text-xs font-medium">Settings</span>
                </button>
                <button onClick={logout} className="flex-1 flex flex-col items-center justify-center gap-1" aria-label="Log out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span className="text-xs font-medium text-red-500">Log out</span>
                </button>
            </footer>
        );
    }

    return (
        <aside className="h-screen w-64 bg-[#F9F9F9] p-4 pt-20 pl-7">
            <nav className="flex flex-col gap-2">
                <Link href="/" className="text-black font-[500] hover:text-emerald-600 hover:bg-[#f0f0f0] rounded-md px-2 py-1">Home</Link>
                <Link href="/chat" className="text-black font-[500] hover:text-emerald-600 hover:bg-[#f0f0f0] rounded-md px-2 py-1">Chatbot</Link>
                <Link href="/settings" className="text-black font-[500] hover:text-emerald-600 hover:bg-[#f0f0f0] rounded-md px-2 py-1">Settings</Link>
                <button
                    onClick={logout}
                    className="text-left text-black font-[500] hover:text-red-500 hover:bg-[#f0f0f0] cursor-pointer rounded-md px-2 py-1">
                    Log out
                </button>
            </nav>
        </aside>
    );
}
