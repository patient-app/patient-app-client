"use client";

import { useTranslation } from "react-i18next";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {ListCheck, Play} from "lucide-react";

interface Test {
    name: string | "unnamed test";
}

// interface TestResult {
//     name: string | "unnamed test";
//     description: string | "";
//     patientId: number;
//     completedAt: string;
//     questions: [{
//         question: string;
//         score: number;
//     }]
// }

const Questionnaires = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [tests, setTests] = useState<Test[]>([]);
    const [patientId, setPatientId] = useState<number | null>(null);
    // const [testResults, setTestResults] = useState<TestResult[]>([]);

    {/* 1. Fetch patientId */}
    useEffect(() => {
        const fetchPatientId = async () => {
            const requestInit: RequestInit = {
                method: "GET",
                credentials: "include",
            };
            try {
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/me", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch patient data");
                    return;
                }
                const patient_response = await response.json();
                if (patient_response.id) {
                    console.log("PatientId: " + patient_response.id);
                    setPatientId(patient_response.id);
                }
            } catch (error) {
                console.error("Error fetching patient data:", error);
                return;
            }
        }

        fetchPatientId();
    }, []);

    {/* 2. Load which tests a patient completed */}
    useEffect(() => {
        if (!patientId) return;

        const fetchTests = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/coach/patients/"+ patientId + "/psychological-tests", requestInit); // TODO: insert patient's ID
                if (!response.ok) {
                    console.warn("Failed to fetch data:");
                    return;
                }

                const respo = await response.json();
                console.log(respo);
                // TODO: setTests(respo);
            } catch (e) {
                console.error(e);
                return;
            }
        };

        fetchTests();
    }, [patientId]);

    // TODO: Remove
    useEffect(() => {
        setTests([
            {
                "name": "Example Test"
            },
            {
                "name": "Example Test 2"
            },
            {
                "name": "GAD-7"
            }
        ]);
    }, []);

    {/* 3. Loop through all tests and load the results */}
    useEffect(() => {
        if (!tests) return;
        for (const test of tests) {
            console.log("Test completed:", test.name);
            // TODO: Create box for each test
            // TODO: Store each result
        }
    }, [tests]);

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">

            <h1 className="text-3xl font-semibold text-center">
                {t("questionnaires.title")}
            </h1>

            <h2 className="text-xl font-semibold text-gray-800 w-full mb-2 text-center">
                {t("questionnaires.selection")}
            </h2>

            <div
                className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
                <div>
                    <p className="font-bold text-lg">GAD-7</p>
                    <p className="text-sm text-gray-500">Generalized Anxiety Disorder 7-item scale</p>
                </div>
                <button
                    onClick={() => router.push("/questionnaires/GAD-7")}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                >
                    Start <Play size={16} />
                </button>
            </div>

            <hr className="w-[50%] border-gray-300 border-1 my-2"/>

            <h2 className="text-xl font-semibold text-gray-800 w-full mb-2 text-center">
                {t("questionnaires.completed")}
            </h2>

            <div
                className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
                <div>
                    <p className="font-bold text-lg">GAD-7</p>
                    <p className="text-sm text-gray-500">Generalized Anxiety Disorder 7-item scale</p>
                </div>
                <button
                    onClick={() => console.log("clicked GAD-7")}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex items-center gap-2 cursor-pointer"
                >
                    View Results <ListCheck size={16} />
                </button>
            </div>

        </main>
    );
};

export default Questionnaires;
