"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationButtonProps {
    isMobile: boolean;
    onClick?: () => void;
    href?: string;
    icon: React.ReactNode;
    label: string;
    showOnMobile?: boolean;
    alignBottom?: boolean;
    className?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
                                                               isMobile,
                                                               onClick,
                                                               href,
                                                               icon,
                                                               label,
                                                               showOnMobile = false,
                                                               alignBottom = false,
                                                               className = "",
                                                           }) => {
    const pathname = usePathname();

    // Check if the current path is the same as the href
    const isActive = pathname === href;
    const selectionClassesDesktop = isActive ? "bg-[hsl(0,0%,90%)] text-emerald-600" : "";
    const selectionClassesMobile = isActive ? "text-emerald-600" : "";

    if (isMobile) {
        if(!showOnMobile) return null; // Don't show on mobile if not specified
        return (
            <button
                onClick={onClick}
                className={`flex-1 flex flex-col items-center justify-center cursor-pointer gap-1 ${selectionClassesMobile} ${className}`}
            >
                {icon}
            </button>
        );
    }

    return (
        <Link href={href || "#"} onClick={onClick} className={`text-[hsl(0,0%,0%)] font-[500] hover:text-emerald-600 hover:bg-[hsl(0,0%,95%)] rounded-md px-2 py-1 ${selectionClassesDesktop} ${alignBottom ? "mt-auto" : ""} ${className}`}>
            {label}
        </Link>
    );
};

export default NavigationButton;