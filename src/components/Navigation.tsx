"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import NavigationButton from "@/components/NavigationButton";

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useTranslation();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 725);
        };
        handleResize(); // initialize
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Navigation is not shown at these sites:
    const noNavigationPages = ["/terms", "/login", "/register", "/reset-password"];
    if (noNavigationPages.includes(pathname)) return null;

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push("/login");
    };

    const topNavButtons = (
        <>
            <NavigationButton
                isMobile={isMobile}
                href="/"
                onClick={() => router.push("/")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>}
                label={t("navigation.home")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/chats"
                onClick={() => router.push("/chats")}
                icon={<svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 27 27"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M14.86 5.3H5.32A3.81 3.81 0 0 0 1.5 9.11v5.73a3.82 3.82 0 0 0 3.82 3.82H7.23l2.86 2.86L13 18.66h1.91a3.82 3.82 0 0 0 3.82-3.82V9.11A3.81 3.81 0 0 0 14.86 5.3Z" />
                    <path d="M18.68 14.84A3.82 3.82 0 0 0 22.5 11V5.3a3.82 3.82 0 0 0-3.82-3.82H9.14A3.82 3.82 0 0 0 5.32 5.3" />
                </svg>
                }
                label={t("navigation.chats")}
                showOnMobile={true}
            />
        </>
    );

    const bottomNavButtons = (
        <>
            <NavigationButton
                isMobile={isMobile}
                href="/settings"
                onClick={() => router.push("/settings")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>}
                label={t("navigation.settings")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                onClick={logout}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>}
                label={t("navigation.logout")}
                showOnMobile={false}
                className="text-red-500"
            />
        </>
    );

    return isMobile ? (
        <footer className="fixed bottom-0 left-0 right-0 bg-[hsl(0,0%,97%)] border-t border-gray-300 flex justify-around py-3 px-2 z-50 h-20">
            {topNavButtons}
            {bottomNavButtons}
        </footer>
    ) : (
        <aside className="h-screen w-64 bg-[#F9F9F9] p-4 pt-20 pl-7">
            <nav className="flex flex-col gap-2 h-full">
                {topNavButtons}
                <div className="mt-auto flex flex-col gap-2">
                    {bottomNavButtons}
                </div>
            </nav>
        </aside>
    );
}
