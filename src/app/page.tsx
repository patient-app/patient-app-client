"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function Home() {
    const router = useRouter();
    const {t, i18n} = useTranslation();


    const [mePatient, setMePatient] = useState<PatientOutputDTO>({
        id: "",
        email: "",
        language: ""
    });

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
                    setMePatient(patient_response);
                    console.log("Patient data fetched successfully", mePatient);
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
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/conversations/patient", requestInit);
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
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
            {mePatient.email ? <div className="w-xl max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 hover:bg-gray-50 transition"><p>{t("home.loggedInAs")}{mePatient.email}</p></div> : <div>{t("home.error.generic")}</div>}
            <div
                onClick={() => router.push(`/chats/${lastChatId}`)}
                className="w-xl max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
            >
                <p>{t("home.lastChat")}</p>
                <p className="font-bold">{lastChatName ? `Conversation ${lastChatName}` : "Unnamed conversation"}</p>
                <p className="italic text-gray-400 text-sm">{lastChatId}</p>
            </div>

        </main>
    );
}