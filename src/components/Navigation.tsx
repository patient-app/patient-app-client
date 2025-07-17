"use client";

import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import NavigationButton from "@/components/NavigationButton";
import {MOBILE_BREAKPOINT} from "@/libs/constants";
import {Home, MessageSquareText, Settings, Dumbbell, NotebookPen, ClipboardPen} from 'lucide-react';

export default function Navigation() {
    const pathname = usePathname();
    const router = useRouter();
    const {t} = useTranslation();

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
        };
        handleResize(); // initialize
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Navigation is not shown at these sites:
    const noNavigationPages = ["/terms", "/login", "/reset-password", "/onboarding"];
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
                icon={<Home size={24} strokeWidth={2} />}
                label={t("navigation.home")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/chats"
                onClick={() => router.push("/chats")}
                icon={<MessageSquareText size={24} strokeWidth={2} />}
                label={t("navigation.chats")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/exercise"
                onClick={() => router.push("/exercise")}
                icon={<Dumbbell size={24} strokeWidth={2} />}
                label={t("navigation.exercise")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/journal"
                onClick={() => router.push("/journal")}
                icon={<NotebookPen size={24} strokeWidth={2} />}
                label={t("navigation.journal")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/questionnaires"
                onClick={() => router.push("/questionnaires")}
                icon={<ClipboardPen size={24} strokeWidth={2} />}
                label={t("navigation.questionnaires")}
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
                icon={<Settings size={24} strokeWidth={2} />}
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
