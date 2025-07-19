"use client";

import { useTranslation } from "react-i18next";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/navigation";
import {ListCheck, Play} from "lucide-react";
import {Modal, ModalBody, ModalHeader} from "flowbite-react";

interface TestResult {
    name: string;
    description: string;
    patientId: string;
    completedAt: string;
    questions: {
        question: string;
        score: number;
    }[];
}

const Questionnaires = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const [tests, setTests] = useState<string[]>([]);
    const [patientId, setPatientId] = useState<number | null>(null);
    const [testModal, setTestModal] = useState(false);
    const [selectedTestName, setSelectedTestName] = useState<string | null>(null);

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
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/coach/patients/"+ patientId + "/psychological-tests", requestInit);
                if (!response.ok) {
                    console.warn("Failed to fetch data:");
                    return;
                }

                const respo = await response.json();
                console.log(respo);

                const names = (respo as { name: string }[]).map(test => test.name);
                setTests(names);
            } catch (e) {
                console.error(e);
                return;
            }
        };

        fetchTests();
    }, [patientId]);

    // TODO: Remove if above API call works
    useEffect(() => {

        const response = [
            {
                "name": "GAD-7"
            },
            {
                "name": "GAD-7A"
            }
        ];
        const names = response.map(test => test.name);
        setTests(names);

    }, []);

    const renderContent = () => {
        if(!tests) {
            return (
                <div className="w-full text-center text-gray-500">
                    {t("questionnaires.noTests")}
                        </div>)
        }
        return tests.map((test) => (
            <div
                key={test}
                className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 flex justify-between items-center hover:bg-gray-50 transition"
            >
                <div>
                    <p className="font-bold text-lg">{test}</p>
                    <p className="text-sm text-gray-500">Click to view Results</p>
                </div>
                <button
                    onClick={() => viewTestResults(test)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition flex items-center gap-2 cursor-pointer"
                >
                    {t("questionnaires.viewResults")} <ListCheck size={16} />
                </button>
            </div>
        ));

    }

    const viewTestResults = (testName: string) => {
        setSelectedTestName(testName);
        setTestModal(true);
    }

    const loadTestResults = (testName: string) => {
        // TODO: API Call
        console.log("Loading", testName);
        const response = [{"name":"GAD-7","description":"Over the last 2 weeks, how often have you been bothered by the following problems?","patientId":"1234512","completedAt":"2025-07-19T07:09:29.651210Z","questions":[{"question":"Feeling nervous, anxious or on edge","score":2},{"question":"Not being able to stop or control worrying","score":3},{"question":"Worrying too much about different things","score":2},{"question":"Trouble relaxing","score":0},{"question":"Being so restless that it is hard to sit still ","score":2},{"question":"Becoming easily annoyed or irritable","score":3},{"question":"Feeling afraid as if something awful might happen","score":3}]},{"name":"GAD-7","description":"Over the last 2 weeks, how often have you been bothered by the following problems?","patientId":"1234512","completedAt":"2025-07-19T07:09:47.539295Z","questions":[{"question":"Feeling nervous, anxious or on edge","score":3},{"question":"Not being able to stop or control worrying","score":3},{"question":"Worrying too much about different things","score":3},{"question":"Trouble relaxing","score":3},{"question":"Being so restless that it is hard to sit still ","score":3},{"question":"Becoming easily annoyed or irritable","score":3},{"question":"Feeling afraid as if something awful might happen","score":3}]}];

        return response.map((test) => {
            console.log("Rendering test:", test);
            return (
                <div
                    key={`${test.name}-${test.completedAt}`}
                    className="w-full p-4 border-t border-b border-gray-300 text-left"
                >
                    <p className="font-semibold text-lg text-center">
                        {new Date(test.completedAt).toLocaleString("de-CH", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
                        })}
                    </p>
                    <p className="text-base text-gray-700">{test.description}</p>
                    <div>
                        <ul className="list-disc ml-4 space-y-1 text-sm text-gray-800">
                            {test.questions.map((q, index) => (
                                <li key={index}>
                                    <span className="font-medium">{q.question}</span>: {q.score}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="text-base text-black mt-2 font-semibold">
                        {t("questionnaires.totalScore")}
                        <span className="text-black">
                            {test.questions.reduce((sum, q) => sum + q.score, 0)}
                        </span>
                    </p>
                </div>
            );
        });
    }

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

            {renderContent()}

            <Modal
                show={testModal}
                onClose={() => setTestModal(false)}
                size="3xl"
                popup
            >
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-black w-full mb-2 text-center">
                            {selectedTestName || t("questionnaires.loadingResults")}
                        </h3>

                        {selectedTestName && loadTestResults(selectedTestName)}

                    </div>
                </ModalBody>
            </Modal>

        </main>
    );
};

export default Questionnaires;
