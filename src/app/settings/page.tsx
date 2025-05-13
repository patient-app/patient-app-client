"use client";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

const languages = [
    { id: "en", label: "English", native: "English" },
    { id: "uk", label: "Ukrainian", native: "Українська" },
];

const Page = () => {
    const { t, i18n } = useTranslation(); // ← get the current instance here
    const [isClient, setIsClient] = useState(false);
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');

    useEffect(() => {
        setIsClient(true);

        const savedLang = localStorage.getItem('lang');
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
            setSelectedLang(savedLang);
        }
    }, [i18n]);

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        localStorage.setItem('lang', lang);
        await i18n.changeLanguage(lang);
        setSelectedLang(lang);
    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
            <h2 className="text-2xl font-medium mb-3">{t('settings.settings')}</h2>

            <form className="flex flex-col items-center gap-4 w-full" style={{ maxWidth: "20rem" }}>
                <div className="flex flex-col gap-2 w-full">
                    <label className="font-semibold" htmlFor="language">{t('settings.language')}</label>
                    <select
                        id="language"
                        name="language"
                        value={selectedLang}
                        onChange={handleLanguageChange}
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
