"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";

export default function Home() {
    const router = useRouter();
    const { t } = useTranslation();


    const [mePatient, setMePatient] = useState<PatientOutputDTO>({
        id: "",
        email: "",
    });

    const logout = async () => {
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
        };
        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/logout", requestInit);
        router.push("/login");
    };

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
                    setMePatient(await response.json());
                }
            } catch (e) {
                console.error(e);
                router.push("/login");
            }
        };
        fetchMyself();
    }, [router]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
            {mePatient.email ? <p>{t("home.loggedInAs")}{mePatient.email}</p> : <div>{t("home.error.generic")}</div>}
            <button className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition" onClick={logout}>
                {t("home.logout")}
            </button>
        </main>
    );
}