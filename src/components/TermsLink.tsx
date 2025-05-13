"use client";

import { usePathname } from "next/navigation";
import {useTranslation} from "react-i18next";

export default function TermsLink() {
    const pathname = usePathname();
    const { t } = useTranslation();

    if (pathname === "/terms") return null;

    return (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 flex gap-2 justify-center">
            <a href="/terms" target="_blank" className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
        </div>
    );
}