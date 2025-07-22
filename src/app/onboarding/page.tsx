"use client";

import {useRouter} from "next/navigation";
import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import AvatarSelector from "@/components/AvatarSelector";

const Onboarding = () => {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const languages = [
        {id: "en", label: "English", native: "English"},
        {id: "uk", label: "Ukrainian", native: "Українська"},
        {id: "de", label: "German", native: "Deutsch"},
    ];
    const [selectedLang, setSelectedLang] = useState(i18n.language || 'en');
    const [error, setError] = useState<string | null>(null);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

    const handleAvatarSelect = (avatar: string) => {
        if(selectedAvatar === avatar) return;
        setSelectedAvatar(avatar);
        setError(null);
    };

    // Add this function to handle avatar submission
    const handleAvatarSubmit = async () => {
        if (!selectedAvatar) {
            setError(t("onboarding.avatarRequired"));
            return;
        }

        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({ chatBotAvatar: selectedAvatar.toUpperCase() }),
                headers: { "Content-Type": "application/json" },
            };

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/chat-bot-avatar", requestInit);

            if (!response.ok) {
                const errorData = await response.json();
                setError((t("onboarding.avatarError") + errorData.message) || t("onboarding.avatarTryAgain"));
                return;
            }

            console.log("Avatar saved successfully: " + selectedAvatar);
            await handleNext();
        } catch (e) {
            setError(t("onboarding.avatarTryAgain"));
            console.error("Failed to save avatar", e);
        }
    };


    useEffect(() => {
        const savedLang = localStorage.getItem('lang');
        if (savedLang && savedLang !== i18n.language) {
            i18n.changeLanguage(savedLang);
            setSelectedLang(savedLang);
        }
    }, [i18n]);

    const [screen, setScreen] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
    const [name, setName] = useState("");

    useEffect(() => {
        const fetchPatientData = async () => {
            const requestInit: RequestInit = {
                method: "GET",
                credentials: "include",
            };
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch patient data");
                    router.push("/login");
                    return;
                }
                const patient_response = await response.json();
                if (patient_response.onboarded) {
                    console.log("Patient is already onboarded, redirecting to dashboard.");
                    router.push("/");
                    return;
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
            }
        };

        fetchPatientData();
    }, [router]);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lang = e.target.value;
        setSelectedLang(lang);
    }

    const sendLanguageChange = async () => {
        const formData = {language: selectedLang};
        setError(null)
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
                setError((t("settings.error.languageFailed") + errorData.message) || t("settings.error.languageTryAgain"));
            } else {
                localStorage.setItem('lang', selectedLang);
                await i18n.changeLanguage(selectedLang);
            }
        } catch (e) {
            setError(t("settings.error.languageTryAgain"));
            console.error("Failed to change language", e);
        }
    };

    const handleNameEntry = async () => {
        const requestInit: RequestInit = {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify({name}),
            headers: {"Content-Type": "application/json"},
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/name", requestInit);
        console.log(JSON.stringify({name}))
        if (!response.ok) {
            const errorData = await response.json();
            setError((t("onboarding.onboardingErrorName") + errorData.message) || t("onboarding.onboardingTryAgainName"));
            return;
        }
        await handleNext()
    }

    const handleNext = async () => {
      if (screen == 1) {
            await sendLanguageChange()
      }
      if (screen < 6) {
            setScreen((prev) => (prev + 1) as 1 | 2 | 3 | 4 | 5);
        } else {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                body: JSON.stringify({"onboarded": true}),
                headers: {"Content-Type": "application/json"},
            };
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/onboarded", requestInit);

            if (!response.ok) {
                const errorData = await response.json();
                setError((t("onboarding.onboardingFailed") + errorData.message) || t("onboarding.onboardingTryAgain"));
                return;
            }
            router.push("/");
            return;
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center">
            {screen === 1 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.welcomeTitle")}</h2>
                    <p>{t("onboarding.welcomeText")}</p>
                    <p><b>{t("onboarding.languageSelection")}</b></p>
                    <div className="w-full flex justify-center">
                        <select
                            id="language"
                            name="language"
                            value={selectedLang}
                            onChange={handleLanguageChange}
                            className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-emerald-600"
                        >
                            {languages.map(lang => (
                                <option key={lang.id} value={lang.id}>
                                    {lang.native} - {lang.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {error && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm max-w-xs mx-auto">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("onboarding.continue")}
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 2 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.termsTitle")}</h2>
                    <p className="max-w-[50%] text-center mx-auto">{t("onboarding.termsText")}</p>
                    <div className="text-gray-600 flex gap-2 justify-center z-10">
                    <a href="/terms" target="_blank" className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
                    </div>
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("onboarding.termsButton")}
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 3 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.nameTitle")}</h2>
                    <div className="w-full flex justify-center">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t("onboarding.namePlaceholder")}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && name.trim()) {
                                    handleNameEntry();
                                }
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-md w-full max-w-xs"
                        />
                    </div>
                    {error && (
                        <div
                            className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm max-w-xs mx-auto">
                            {error}
                        </div>
                    )}
                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleNameEntry}
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 cursor-pointer"
                        >
                            {t("onboarding.continue")}
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 4 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.infoTitle", {name})}</h2>
                    <p>{t("onboarding.infoText_1")}<br/>{t("onboarding.infoText_2")}</p>
                    <button
                        onClick={handleNext}
                        className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer"
                    >
                        {t("onboarding.continue")}
                    </button>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 5 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.chooseAvatarTitle")}</h2>
                    <p className="mb-6">{t("onboarding.chooseAvatarText")}</p>

                    <AvatarSelector selectedAvatar={selectedAvatar} onSelect={handleAvatarSelect} />

                    {error && (
                        <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm max-w-xs mx-auto">
                            {error}
                        </div>
                    )}

                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleAvatarSubmit}
                            disabled={!selectedAvatar}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {t("onboarding.continue")}
                        </button>
                    </div>

                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-white"}></div>
                    </div>
                </div>
            )}

            {screen === 6 && (
                <div className="w-4/5 text-center space-y-4 p-20 rounded-md shadow-xl bg-gray-50">
                    <h2 className="text-2xl font-semibold">{t("onboarding.configuredTitle")}</h2>
                    <p>{t("onboarding.configuredText")}</p>

                    <div className="w-full flex justify-center">
                        <button
                            onClick={handleNext}
                            disabled={!name.trim()}
                            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {t("onboarding.finish")}
                        </button>
                    </div>
                    <div className="flex justify-center gap-2 mt-4">
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                        <div className={"w-2.5 h-2.5 rounded-full border border-gray-400 bg-gray-400"}></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Onboarding;