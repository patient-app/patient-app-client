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
    const noNavigationPages = ["/terms", "/login", "/register", "/reset-password", "/onboarding"];
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
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>}
                label={t("navigation.home")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/chats"
                onClick={() => router.push("/chats")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text-icon lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M13 8H7"/><path d="M17 12H7"/></svg>
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
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>}
                label={t("navigation.settings")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                onClick={logout}
                icon={undefined}
                label={t("navigation.logout")}
                showOnMobile={false}
                className="text-red-500"
            />
        </>
    );

    return isMobile ? (
        <footer
            className="fixed bottom-0 left-0 right-0 bg-[hsl(0,0%,97%)] border-t border-gray-300 flex justify-around py-3 px-2 z-50 h-20">
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
