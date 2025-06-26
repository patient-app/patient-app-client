"use client";

import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ChangePasswordPatientDTO} from "@/dto/input/ChangePasswordPatientDTO";
import PasswordField from "@/components/PasswordField";

const languages = [
    {id: "en", label: "English", native: "English"},
    {id: "uk", label: "Ukrainian", native: "Українська"},
];

const rules = [
    {key: "minLength", value: 8},
    {key: "uppercase", value: 1},
    {key: "number", value: 1},
    {key: "specialChar", value: 1},
];

const checkIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-check-icon lucide-check">
        <path d="M20 6 9 17l-5-5"/>
    </svg>
);

const crossIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"
         width="16"
         height="16"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-x-icon lucide-x">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
    </svg>
);

const Page = () => {
    const {t, i18n} = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState(i18n.language || "en");
    const [languageError, setLanguageError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordRules, setPasswordRules] = useState({
        minLength: false,
        uppercase: false,
        number: false,
        specialChar: false
    });

    const [formData, setFormData] = useState<ChangePasswordPatientDTO & { confirmPassword: string }>({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const allRulesValid = Object.values(passwordRules).every(Boolean);
    const passwordsMismatch = formData.confirmPassword !== "" && formData.newPassword !== formData.confirmPassword;

    useEffect(() => {
        setIsClient(true);
        const savedLang = localStorage.getItem("lang");
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
            setSelectedLang(savedLang);
        }
    }, [i18n]);

    useEffect(() => {
        const newPassword = formData.newPassword;
        setPasswordRules({
            minLength: newPassword.length >= 8,
            uppercase: /[A-Z]/.test(newPassword),
            number: /\d/.test(newPassword),
            specialChar: /[^A-Za-z0-9]/.test(newPassword),
        });
    }, [formData.newPassword]);

    useEffect(() => {
        if (passwordSuccess) {
            const timer = setTimeout(() => {
                setPasswordSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [passwordSuccess]);

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push("/login");
    };

    const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        const formData = {language: lang};
        setLanguageError(null);
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
                setLanguageError(
                    (t("settings.error.languageFailed") + errorData.message) ||
                    t("settings.error.languageTryAgain")
                );
            } else {
                localStorage.setItem("lang", lang);
                await i18n.changeLanguage(lang);
                setSelectedLang(lang);
            }
        } catch (e) {
            setLanguageError(t("settings.error.languageTryAgain"));
            console.error("Failed to change language", e);
        }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            setPasswordError(t("settings.error.passwordEmptyFields"));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError(t("settings.error.passwordsDoNotMatch"));
            return;
        }

        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    currentPassword: formData.oldPassword,
                    newPassword: formData.newPassword,
                }),
            };
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/passwords`, requestInit);

            if (response.status !== 204) {
                const errorData = await response.json();
                setPasswordError(
                    (t("settings.error.passwordChangeFailed") + errorData.message) ||
                    t("settings.error.passwordChangeTryAgain")
                );
                setPasswordSuccess(false);
            } else {
                setPasswordSuccess(true);
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: ""
                });
                setShowOld(false);
                setShowNew(false);
                setShowConfirm(false);
                setPasswordError(null);
            }
        } catch (e) {
            console.error("Failed to change password", e);
            setPasswordError(t("settings.error.passwordChangeTryAgain"));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };


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

                    {languageError && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {languageError}
                        </div>
                    )}
                </div>

                {/* Password Change Form */}
                <form onSubmit={handleConfirm} className="w-full space-y-2">
                    <h2 className="text-lg font-semibold text-gray-800">{t("settings.password.label")}</h2>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="oldPassword">
                            {t("settings.password.old")}
                        </label>
                        <PasswordField
                            id="oldPassword"
                            value={formData.oldPassword}
                            placeholder={t("settings.password.old")}
                            show={showOld}
                            toggle={() => setShowOld(!showOld)}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="newPassword">
                            {t("settings.password.new")}
                        </label>
                        <PasswordField
                            id="newPassword"
                            value={formData.newPassword}
                            placeholder={t("settings.password.new")}
                            show={showNew}
                            toggle={() => setShowNew(!showNew)}
                            onChange={handleChange}
                        />
                    </div>

                    {formData.newPassword && (
                        <div className="mt-2 text-sm text-gray-600 space-y-1">
                            {rules.map((rule) => (
                                <div
                                    key={rule.key}
                                    className={`flex items-center gap-2 ${
                                        passwordRules[rule.key as keyof typeof passwordRules]
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    <span>
                                        {passwordRules[rule.key as keyof typeof passwordRules]
                                            ? checkIcon
                                            : crossIcon}
                                    </span>
                                    <span>{t(`settings.password.rules.${rule.key}`, {value: rule.value})}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1" htmlFor="confirmPassword">
                            {t("settings.password.confirm")}
                        </label>
                        <PasswordField
                            id="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder={t("settings.password.confirm")}
                            show={showConfirm}
                            toggle={() => setShowConfirm(!showConfirm)}
                            onChange={handleChange}
                        />
                    </div>

                    {passwordsMismatch && (
                        <div
                            className="mt-2 text-sm text-red-700 space-y-1">
                            {t("settings.error.passwordsDoNotMatch")}
                        </div>
                    )}

                    {passwordError && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                            {passwordError}
                        </div>
                    )}

                    {passwordSuccess && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                            {t("settings.password.success")}
                        </div>
                    )}

                    <button
                        className="w-full px-4 py-2 mt-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition disabled:bg-gray-300"
                        type="submit"
                        disabled={!allRulesValid || passwordsMismatch || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
                    >
                        {t("settings.password.button")}
                    </button>
                </form>
                <button
                    className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer"
                    type="submit" color="primary" style={{maxWidth: "20rem"}} onClick={logout}> {t("settings.logout")}
                </button>
            </div>
        </div>
    );
};

export default Page;
