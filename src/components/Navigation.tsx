"use client";

import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import NavigationButton from "@/components/NavigationButton";
import {MOBILE_BREAKPOINT} from "@/libs/constants";

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
    const noNavigationPages = ["/terms", "/login", "/register", "/reset-password", "/onboarding"];
    if (noNavigationPages.includes(pathname)) return null;

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        window.location.href = "/login";
    };

    const topNavButtons = (
        <>
            <NavigationButton
                isMobile={isMobile}
                href="/"
                onClick={() => router.push("/")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>}
                label={t("navigation.home")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/chats"
                onClick={() => router.push("/chats")}
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="lucide lucide-message-square-text-icon lucide-message-square-text">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M13 8H7"/>
                    <path d="M17 12H7"/>
                </svg>
                }
                label={t("navigation.chats")}
                showOnMobile={true}
            />
            <NavigationButton
                isMobile={isMobile}
                href="/exercise"
                onClick={() => router.push("/exercise")}
                icon={<svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M3 24C2.175 24 1.469 23.7065 0.882002 23.1195C0.295002 22.5325 0.00100254 21.826 2.54237e-06 21C-0.000997457 20.174 0.293002 19.468 0.882002 18.882C1.471 18.296 2.177 18.002 3 18C3.823 17.998 4.5295 18.292 5.1195 18.882C5.7095 19.472 6.003 20.178 6 21C5.997 21.822 5.7035 22.5285 5.1195 23.1195C4.5355 23.7105 3.829 24.004 3 24ZM3 15C2.175 15 1.469 14.7065 0.882002 14.1195C0.295002 13.5325 0.00100254 12.826 2.54237e-06 12C-0.000997457 11.174 0.293002 10.468 0.882002 9.88199C1.471 9.29599 2.177 9.00199 3 8.99999C3.823 8.99799 4.5295 9.29199 5.1195 9.88199C5.7095 10.472 6.003 11.178 6 12C5.997 12.822 5.7035 13.5285 5.1195 14.1195C4.5355 14.7105 3.829 15.004 3 15ZM3 6C2.175 6 1.469 5.7065 0.882002 5.1195C0.295002 4.5325 0.00100254 3.826 2.54237e-06 3C-0.000997457 2.17401 0.293002 1.46801 0.882002 0.882008C1.471 0.296009 2.177 0.00201013 3 1.01351e-05C3.823 -0.00198986 4.5295 0.292009 5.1195 0.882008C5.7095 1.47201 6.003 2.17801 6 3C5.997 3.822 5.7035 4.5285 5.1195 5.1195C4.5355 5.7105 3.829 6.004 3 6ZM12 6C11.175 6 10.469 5.7065 9.882 5.1195C9.295 4.5325 9.001 3.826 9 3C8.999 2.17401 9.293 1.46801 9.882 0.882008C10.471 0.296009 11.177 0.00201013 12 1.01351e-05C12.823 -0.00198986 13.5295 0.292009 14.1195 0.882008C14.7095 1.47201 15.003 2.17801 15 3C14.997 3.822 14.7035 4.5285 14.1195 5.1195C13.5355 5.7105 12.829 6.004 12 6ZM21 6C20.175 6 19.469 5.7065 18.882 5.1195C18.295 4.5325 18.001 3.826 18 3C17.999 2.17401 18.293 1.46801 18.882 0.882008C19.471 0.296009 20.177 0.00201013 21 1.01351e-05C21.823 -0.00198986 22.5295 0.292009 23.1195 0.882008C23.7095 1.47201 24.003 2.17801 24 3C23.997 3.822 23.7035 4.5285 23.1195 5.1195C22.5355 5.7105 21.829 6.004 21 6ZM12 15C11.175 15 10.469 14.7065 9.882 14.1195C9.295 13.5325 9.001 12.826 9 12C8.999 11.174 9.293 10.468 9.882 9.88199C10.471 9.29599 11.177 9.00199 12 8.99999C12.823 8.99799 13.5295 9.29199 14.1195 9.88199C14.7095 10.472 15.003 11.178 15 12C14.997 12.822 14.7035 13.5285 14.1195 14.1195C13.5355 14.7105 12.829 15.004 12 15ZM13.5 22.5V20.025C13.5 19.825 13.5375 19.6315 13.6125 19.4445C13.6875 19.2575 13.8 19.0885 13.95 18.9375L21.7875 11.1375C22.0125 10.9125 22.2625 10.75 22.5375 10.65C22.8125 10.55 23.0875 10.5 23.3625 10.5C23.6625 10.5 23.95 10.5565 24.225 10.6695C24.5 10.7825 24.75 10.951 24.975 11.175L26.3625 12.5625C26.5625 12.7875 26.719 13.0375 26.832 13.3125C26.945 13.5875 27.001 13.8625 27 14.1375C26.999 14.4125 26.949 14.694 26.85 14.982C26.751 15.27 26.5885 15.526 26.3625 15.75L18.5625 23.55C18.4125 23.7 18.244 23.8125 18.057 23.8875C17.87 23.9625 17.676 24 17.475 24H15C14.575 24 14.219 23.8565 13.932 23.5695C13.645 23.2825 13.501 22.926 13.5 22.5ZM15.75 21.75H17.175L21.7125 17.175L21.0375 16.4625L20.325 15.7875L15.75 20.325V21.75ZM21.0375 16.4625L20.325 15.7875L21.7125 17.175L21.0375 16.4625Z"
                        fill="currentColor"/>
                </svg>
                }
                label={t("navigation.exercise")}
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
                icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                           className="lucide lucide-settings-icon lucide-settings">
                    <path
                        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                    <circle cx="12" cy="12" r="3"/>
                </svg>}
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
