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
                    console.log("Patient data fetched successfully", mePatient);
                    localStorage.setItem('lang', patient_response.language);
                    await i18n.changeLanguage(patient_response.language);
                }
            } catch (e) {
                console.error(e);
                router.push("/login");
            }
        };
        fetchMyself();
    }, [i18n, mePatient, router]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
            {mePatient.email ? <p>{t("home.loggedInAs")}{mePatient.email}</p> : <div>{t("home.error.generic")}</div>}
        </main>
    );
}