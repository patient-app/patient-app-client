"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import MeetingComponent from "@/components/MeetingComponent";
import {CircleArrowRight, MessageSquarePlus} from "lucide-react";

const tile_class = "w-full lg:w-[calc(50%-0.5rem)] border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 h-[250px] flex flex-col";
const header_class = "text-xl font-semibold mb-2";

export default function Home() {
    const router = useRouter();
    const {t, i18n} = useTranslation();

    const [mePatient, setMePatient] = useState<PatientOutputDTO>();

    const [lastChatId, setLastChatId] = useState<string | null>(null);
    const [lastChatName, setLastChatName] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyself = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch patient data");
                    router.push("/login");
                } else {
                    const patient_response = await response.json();

                    if (!patient_response.onboarded && window.location.pathname !== "/onboarding") {
                        console.log("Patient is not onboarded, redirecting to onboarding.");
                        router.push("/onboarding");
                        return;
                    }

                    setMePatient(patient_response);
                    console.log("Patient data fetched successfully", patient_response);
                    localStorage.setItem('lang', patient_response.language);
                    await i18n.changeLanguage(patient_response.language);
                }
            } catch (e) {
                console.error(e);
                router.push("/login");
            }

            // Fetch last chat if available
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data");
                    return;
                }

                const respo = await response.json();
                console.log(respo);
                if (respo.length > 0) {
                    const last = respo[respo.length - 1];
                    setLastChatId(last.id);
                    setLastChatName(last.name);
                }
                console.log("Conversations fetched successfully", respo);
            } catch (e) {
                console.error(e);
                return;
            }
        };
        fetchMyself();
    }, [i18n, router]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
            {mePatient?.name ? `${t("home.welcome")}, ${mePatient.name}!` : t("home.title")}

            <MeetingComponent/>

            {/* Tile Layout */}
            <div className="w-[90%] lg:w-[65%] flex flex-row flex-wrap items-start justify-center gap-4">

                {/* Tile: Your Information */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.yourInformation.title")}</h2>
                    <div className="flex-grow flex flex-col gap-2">
                        <p><strong>{t("home.yourInformation.name")}</strong> {mePatient?.name || "unknown"}</p>
                        <p><strong>{t("home.yourInformation.email")}</strong> {mePatient?.email || "unknown"}</p>
                        <p>
                            <strong>{t("home.yourInformation.language")}</strong>{" "}
                            {mePatient?.language === "en"
                                ? "English"
                                : mePatient?.language === "de"
                                ? "German"
                                : mePatient?.language === "uk"
                                ? "Ukrainian"
                                : mePatient?.language || "unknown"}
                        </p>
                        <p><strong>{t("home.yourInformation.avatar")}</strong> {mePatient?.chatBotAvatar ? mePatient.chatBotAvatar.charAt(0).toUpperCase() + mePatient.chatBotAvatar.slice(1).toLowerCase() : "unknown"}</p>
                        <p><strong>{t("home.yourInformation.id")}</strong> {mePatient?.id || "unknown"}</p>
                    </div>
                </div>

                {/* Tile: Last Conversation */}
                <div className={tile_class}>
                    <h2 className={header_class}>{t("home.lastChat")}</h2>
                    <div className="flex-grow">
                        {lastChatId ?
                            <div className="border border-gray-300 rounded-md p-3 flex flex-col items-center">
                                <p className="font-bold">{lastChatName ? lastChatName : t("chats.unnamedConversation")}</p>
                                <p className="italic text-gray-400 text-sm text-center">{lastChatId}</p>
                                <button
                                    onClick={() => router.push(`/chats/${lastChatId}`)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
                                >
                                    {t("home.continueConversation")} <CircleArrowRight size={20} strokeWidth={2} />
                                </button>
                            </div>
                            :
                            <p className="italic text-gray-500">{t("home.noConversationsYet")}</p>
                        }
                    </div>
                    <button
                        onClick={() => router.push('/chat')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center justify-center gap-2 cursor-pointer mt-auto"
                    >
                        {t("home.startNewConversation")} <MessageSquarePlus size={20} strokeWidth={2} />
                    </button>
                </div>

            </div>
            <div
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm text-gray-600 flex gap-2 justify-center z-10">
                <a href="/terms" target="_blank" className="text-emerald-600 hover:underline">{t("footer.terms")}</a>
            </div>
        </main>
    );
}