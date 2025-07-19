"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DocumentDTO} from "@/dto/output/DocumentDTO";
import {useRouter} from "next/navigation";

const DocumentsPage = () => {
    const {t} = useTranslation();
    const router = useRouter();


    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);

    useEffect(() => {
            const getDocuments = async () => {
                try {
                    const requestInit: RequestInit = {
                        method: "GET",
                        credentials: "include"
                    }
                    const response = await fetch(
                        process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/documents", requestInit);
                    if (!response.ok) {
                        const errorData = await response.json();
                        setError(t("documents.error.fetchFailed") + errorData.message); //TODO: verify it displays
                    } else {
                        const documentResponse = await response.json();
                        setDocuments(documentResponse);
                    }
                } catch (e) {
                    console.error("Failed to fetch documents: ", e);
                    setError(t("documents.error.fetchFailedTryAgain"));
                }
            }
            getDocuments();


        }, []
    );
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Documents Page</h1>
            <p className="text-gray-600">This is the documents page.</p>
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md">
                    {error}
                </div>
            )}
            {documents.map((individualDocument) => (
                <button
                    key={individualDocument.id}
                    onClick={() => router.push(`/documents/${individualDocument.id}`)}
                    className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                >
                    <p className="font-bold">{individualDocument.filename}</p>
                </button>
            ))}

        </div>
    );
};

export default DocumentsPage;