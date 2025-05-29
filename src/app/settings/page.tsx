"use client";

import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";

const languages = [
    {id: "en", label: "English", native: "English"},
    {id: "uk", label: "Ukrainian", native: "Українська"},
];

const eyeIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-eye-icon lucide-eye"
    >
        <path
            d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const eyeOffIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-eye-off-icon lucide-eye-off"
    >
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/>
        <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/>
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/>
        <path d="m2 2 20 20"/>
    </svg>
);

const Page = () => {
    const {t, i18n} = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const [selectedLang, setSelectedLang] = useState(i18n.language || "en");
    const [error, setError] = useState<string | null>(null);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        setIsClient(true);

        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
            setSelectedLang(savedLang);
        }
    }, [i18n]);

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        const formData = {language: lang};
        setError(null);
        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify(formData),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/language", requestInit);
            if (!response.ok) {
                const errorData = await response.json();
                setError(
                    (t("settings.error.languageFailed") + errorData.message) ||
                    t("settings.error.languageTryAgain")
                );
            } else {
                localStorage.setItem("lang", lang);
                await i18n.changeLanguage(lang);
                setSelectedLang(lang);
            }
        } catch (e) {
            setError(t("settings.error.languageTryAgain"));
            console.error("Failed to change language", e);
        }
    };

    const renderPasswordField = (
        id: string,
        placeholder: string,
        show: boolean,
        toggle: () => void
    ) => (
        <div className="relative">
            <input
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                name={id}
                type={show ? "text" : "password"}
                id={id}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={toggle}
                className="absolute right-3 top-2"
                aria-label="Toggle password visibility"
            >
                {show ? eyeOffIcon : eyeIcon}
            </button>
        </div>
    );

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
    }

    if (!isClient) return null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-18">
            <h1 className="text-3xl font-semibold text-center">{t("settings.title")}</h1>
            <div className="flex flex-col items-center gap-4 w-full" style={{maxWidth: "20rem"}}>
                {/* Language Selection */}
                <div className="w-full">
                    <label className="block font-semibold text-gray-700 mb-1" htmlFor="language">
                        {t("settings.language")}
                    </label>
                    <select
                        id="language"
                        name="language"
                        value={selectedLang}
                        onChange={handleLanguageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                                {lang.native} - {lang.label}
                            </option>
                        ))}
                    </select>

                    {error && (
                        <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                </div>

                {/* Password Change Form */}
                <form onSubmit={handleConfirm} className="w-full space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800">{t("settings.password.label")}</h2>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="passwordOld">
                            {t("settings.password.old")}
                        </label>
                        {renderPasswordField("passwordOld", t("settings.password.old"), showOld, () => setShowOld(!showOld))}
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="passwordNew">
                            {t("settings.password.new")}
                        </label>
                        {renderPasswordField("passwordNew", t("settings.password.new"), showNew, () => setShowNew(!showNew))}
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="passwordConfirm">
                            {t("settings.password.confirm")}
                        </label>
                        {renderPasswordField("passwordConfirm", t("settings.password.confirm"), showConfirm, () =>
                            setShowConfirm(!showConfirm)
                        )}
                    </div>

                    <button
                        className="w-full px-4 py-2 mt-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition"
                        type="submit"
                    >
                        {t("settings.password.button")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Page;
