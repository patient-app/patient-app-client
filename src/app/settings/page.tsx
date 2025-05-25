"use client";

import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

const languages = [
    {id: "en", label: "English", native: "English"},
    {id: "uk", label: "Ukrainian", native: "Українська"},
];

const Page = () => {
    const {t, i18n} = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
    const [error, setError] = useState<string | null>(null);

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
        const formData = {language: lang};
        setError(null)
        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
            if (response.status !== 204) {
                const errorData = await response.json();
                setError((t("settings.error.languageFailed") + errorData.message) || t("settings.error.languageTryAgain"));
            } else {
                localStorage.setItem('lang', lang);
                await i18n.changeLanguage(lang);
                setSelectedLang(lang);
            }
        } catch (e) {
            setError(t("settings.error.languageTryAgain")
            );
            console.error("Failed to change language", e);
        }

    };

    if (!isClient) return null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
            <h1 className="text-3xl font-semibold text-center">{t("settings.title")}</h1>
            <form className="flex flex-col items-center gap-4 w-full" style={{maxWidth: "20rem"}}>
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
                    {error && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default Page;
