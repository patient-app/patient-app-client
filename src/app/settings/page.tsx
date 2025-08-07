"use client";

import {useTranslation} from "react-i18next";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {ChangePasswordPatientDTO} from "@/dto/input/ChangePasswordPatientDTO";
import PasswordField from "@/components/PasswordField";
import {Check, X} from "lucide-react";
import AvatarSelector from "@/components/AvatarSelector";
import {BASE_PATH} from "@/libs/constants";
import ErrorComponent from "@/components/ErrorComponent";


const title_style = "text-xl font-semibold text-gray-800 w-full mb-2 text-center";
const hr_style = "w-full border-gray-300 border-1 my-2";

const languages = [
    {id: "en", label: "English", native: "English"},
    {id: "uk", label: "Ukrainian", native: "Українська"},
    {id: "de", label: "German", native: "Deutsch"},
];

const rules = [
    {key: "minLength", value: 8},
    {key: "uppercase", value: 1},
    {key: "number", value: 1},
    {key: "specialChar", value: 1},
];

const Page = () => {
    const {t, i18n} = useTranslation();
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();
    const [selectedLang, setSelectedLang] = useState(i18n.language || "en")
    const [name, setName] = useState("");
    const [nameError, setNameError] = useState<string | null>(null);
    const [nameSuccess, setNameSuccess] = useState(false);
    const [languageError, setLanguageError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [avatarError, setAvatarError] = useState<string | null>(null);
    const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
    const [notificationError, setNotificationError] = useState<string | null>(null);
    const [notificationSuccess, setNotificationSuccess] = useState(false);

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const [notificationEnabled, setNotificationEnabled] = useState(false);


    const handleAvatarSelect = async (avatar: string) => {
        if (selectedAvatar === avatar) return;
        const avatarBefore = selectedAvatar;
        setSelectedAvatar(avatar);
        setAvatarError(null);
        setAvatarSuccess(null);

        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({chatBotAvatar: avatar.toUpperCase()}),
                headers: {"Content-Type": "application/json"},
            };

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/chat-bot-avatar", requestInit);

            if (!response.ok) {
                const errorData = await response.json();
                setAvatarError((t("onboarding.avatarError") + errorData.message) || t("onboarding.avatarTryAgain"));
                setSelectedAvatar(avatarBefore);
                return;
            }

            setAvatarSuccess(t("settings.avatarSuccess"));
        } catch (e) {
            setAvatarError(t("onboarding.avatarTryAgain"));
            setSelectedAvatar(avatarBefore);
            console.error("Failed to save avatar", e);
        }
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/chat-bot-avatar", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    setAvatarError(t("settings.error.avatarFetchTryAgain"));
                }
                const data = await response.json();
                setSelectedAvatar(data.chatBotAvatar.toLowerCase());
            } catch (error) {
                console.error("Failed to fetch avatar", error);
                setAvatarError(t("settings.error.avatarFetchTryAgain"));
            }
        };
        fetchAvatar();
    }, [t]);

    useEffect(() => {
        const fetchNotificationSettings = async () => {
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/notifications", {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    setNotificationError(t("settings.error.notificationFetchFailed"));
                    return;
                }
                const data = await response.json();
                setNotificationEnabled(data.getNotifications);
            } catch (error) {
                console.log("Failed to fetch notification settings:", error);
                setNotificationError(t("settings.error.notificationFetchFailed"));
            }
        };
        fetchNotificationSettings();
    }, [t]);

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
            uppercase: /\p{Lu}/u.test(newPassword),
            number: /\d/.test(newPassword),
            specialChar: /[^\p{L}\d]/u.test(newPassword),
        });
    }, [formData.newPassword]);

    useEffect(() => {
        if (passwordSuccess || nameSuccess || avatarSuccess || notificationSuccess) {
            const timer = setTimeout(() => {
                setPasswordSuccess(false);
                setNameSuccess(false);
                setAvatarSuccess(null);
                setNotificationSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [passwordSuccess, nameSuccess, avatarSuccess, notificationSuccess]);


    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push(`${BASE_PATH}/login`);
    };

    const handleNameChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setNameError(null);
        const requestInit: RequestInit = {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({name}),
            headers: {"Content-Type": "application/json"},
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/name", requestInit);
        if (!response.ok) {
            const errorData = await response.json();
            setNameError((t("settings.error.nameChangeFailed") + errorData.message) || t("settings.error.nameChaneTryAgain"));
            setNameSuccess(false)
        } else {
            setNameSuccess(true);
            setName("")
            setNameError(null);
        }
    }

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

    const handleNotificationToggle = async () => {
        if (notificationEnabled === null) return;
        const newStatus = !notificationEnabled;
        setNotificationError(null);

        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/notifications", {
                method: "PUT",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({getNotifications: newStatus}),
            });

            if (response.status !== 204) {
                const errorData = await response.json();
                console.error("Failed to update notification settings", errorData.message);
                setNotificationError(t("settings.error.notificationsUpdateFailed"));
            }

            setNotificationEnabled(newStatus);
            setNotificationSuccess(true);
        } catch (error) {
            console.error("Failed to update notification settings", error);
            setNotificationError(t("settings.error.notificationsUpdateFailed"));
        }
    };


    if (!isClient) return null;

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start pt-10 mb-15 desktop:mb-0">
            <h1 className="text-3xl font-semibold text-center mb-4">{t("settings.title")}</h1>
            <div className="flex flex-col items-center gap-4 w-full" style={{maxWidth: "20rem"}}>
                {/* Language Selection */}
                <div className="w-full">

                    <h2 className={title_style}>
                        {t("settings.language")}
                    </h2>
                    <select
                        id="language"
                        name="language"
                        value={selectedLang}
                        onChange={handleLanguageChange}
                        className="mb-3 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        {languages.map((lang) => (
                            <option key={lang.id} value={lang.id}>
                                {lang.native} - {lang.label}
                            </option>
                        ))}
                    </select>

                    <ErrorComponent message={languageError}/>

                </div>
                <hr className={hr_style}/>

                {/* Name Change Form */}
                <form onSubmit={handleNameChange} className="w-full space-y-2">

                    <div>
                        <h2 className={title_style}>
                            {t("settings.name.label")}
                        </h2>
                        <input
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                            id="nameChange"
                            type="text"
                            value={name}
                            placeholder={t("settings.name.placeholder")}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <ErrorComponent message={nameError}/>

                    {nameSuccess && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                            {t("settings.name.success")}
                        </div>
                    )}

                    <button
                        className="mb-3 w-full px-4 py-2 mt-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition disabled:bg-gray-300"
                        type="submit"
                        disabled={!name.trim()}
                    >
                        {t("settings.name.button")}
                    </button>
                </form>
                <hr className={hr_style}/>

                {/* Password Change Form */}
                <form onSubmit={handleConfirm} className="w-full space-y-2">
                    <h2 className={title_style}>
                        {t("settings.password.label")}
                    </h2>

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
                                    className={`flex items-center gap-2 ${passwordRules[rule.key as keyof typeof passwordRules]
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                >
                                    <span>
                                        {passwordRules[rule.key as keyof typeof passwordRules]
                                            ? <Check className="w-4 h-4"/>
                                            : <X className="w-4 h-4"/>}
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

                    <ErrorComponent message={passwordError}/>


                    {passwordSuccess && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                            {t("settings.password.success")}
                        </div>
                    )}

                    <button
                        className="w-full px-4 py-2 mb-3 mt-2 bg-emerald-600 text-white font-medium rounded-md hover:bg-emerald-700 transition disabled:bg-gray-300"
                        type="submit"
                        disabled={!allRulesValid || passwordsMismatch || !formData.oldPassword || !formData.newPassword || !formData.confirmPassword}
                    >
                        {t("settings.password.button")}
                    </button>
                </form>
                <hr className={hr_style}/>

                {/* Notification Settings */}
                <h2 className={title_style}>
                    {t("settings.notificationLabel")}
                </h2>
                <div className="w-full flex items-center justify-between py-2">
                    <span className="block font-semibold text-gray-700 mb-1">
                        {notificationEnabled
                            ? t("settings.notifications.enabled")
                            : t("settings.notifications.disabled")}
                    </span>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            id="notificationToggle"
                            type="checkbox"
                            checked={notificationEnabled || false}
                            onChange={handleNotificationToggle}
                            className="sr-only peer"
                        />
                        <div
                            className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-teal-200 dark:peer-focus:ring-teal-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-teal-400 dark:peer-checked:bg-teal-400"/>
                    </label>
                </div>

                <ErrorComponent message={notificationError}/>
                {notificationSuccess && (
                    <div
                        className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                        {t("settings.notificationSuccess")}
                    </div>
                )}
                <hr className={hr_style}/>

                {/* Avatar Selector */}
                <h2 className={title_style}>
                    {t("settings.avatarLabel")}
                </h2>
                <AvatarSelector selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect}/>
                <ErrorComponent message={avatarError}/>
                {avatarSuccess && (
                    <div
                        className="w-full mt-2 px-4 py-2 bg-green-100 text-green-700 border border-green-300 rounded-md text-sm">
                        {avatarSuccess}
                    </div>
                )}
                <hr className={hr_style}/>


                {/* Log out */}
                <button
                    className="w-full mt-3 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer"
                    type="submit" color="primary" style={{maxWidth: "20rem"}} onClick={logout}> {t("settings.logout")}
                </button>
                {/* Terms of use*/}
                <a href={`${BASE_PATH}/terms`} target="_blank"
                   className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
            </div>
        </div>
    );
};

export default Page;
