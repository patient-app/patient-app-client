"use client";

import {usePathname, useRouter} from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();

    {/* Navigation is not shown at these sites:*/}
    const noNavigationPages = ["/terms", "/login", "/register"];
    if (noNavigationPages.includes(pathname)) return null;

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push("/login");
    };

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