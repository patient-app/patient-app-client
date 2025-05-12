"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from 'next/navigation';
import React from "react";

const languages = [
    { id: "en", label: "English", native: "English" },
    { id: "uk", label: "Ukrainian", native: "Українська" },
];

const Page = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation();



    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
            <h2 className="text-2xl font-medium mb-3">{t('settings.settings')}</h2>

            <form className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "20rem" }}>
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold" htmlFor="language">{t('settings.language')}</label>
                    <select
                        id="language"
                        name="language"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                    >
                        {languages.map(lang => (
                            <option key={lang.id} value={lang.id}>
                                {lang.native} - {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
            </form>
        </div>
    );
};

export default Page;