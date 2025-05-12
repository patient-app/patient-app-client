"use client";

import {PatientOutputDTO} from "@/dto/output/PatientOutputDTO";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export default function Home() {
    const router = useRouter();

    const [mePatient, setMePatient] = useState<PatientOutputDTO>({
        id: "",
        email: "",
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
                    setMePatient(await response.json());
                }
            } catch (e) {
                console.error(e);
                router.push("/login");
            }
        };
        fetchMyself();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold">Welcome to the Patient App</h1>
            {mePatient.email ? <p>You are logged in as: {mePatient.email}</p> : <div>Something went wrong</div>}
        </main>
    );
}
