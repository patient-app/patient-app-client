"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {DocumentDTO} from "@/dto/output/DocumentDTO";
import {useRouter} from "next/navigation";
import {File} from 'lucide-react';
import {BASE_PATH} from "@/libs/constants";

const DocumentsPage = () => {
    const {t} = useTranslation();
    const router = useRouter();


    const [error, setError] = useState<string | null>(null);
    const [documents, setDocuments] = useState<DocumentDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


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
                        setError(t("documents.error.fetchFailed") + errorData.message);
                    } else {
                        const documentResponse = await response.json();
                        setDocuments(documentResponse);
                    }
                } catch (e) {
                    console.error("Failed to fetch documents: ", e);
                    setError(t("documents.error.fetchFailedTryAgain"));
                } finally {
                    setLoading(false)
                }
            }
            getDocuments();


        }, [t]
    );

    const renderContent = () => {
        if (loading) {
            return (
                <div className="w-full flex justify-center items-center">
                    <svg className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                         viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"/>
                        <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"/>
                    </svg>
                </div>
            );
        } else if (error) {
            return (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            );
        } else if (documents.length === 0) {
            return (
                <div className="w-full text-center text-gray-500">
                    {t("documents.noDocuments")}
                </div>
            );
        } else {
            return documents.map((individualDocument) => (
                <button
                    key={individualDocument.id}
                    onClick={() => router.push(`${BASE_PATH}/documents/${individualDocument.id}`)}
                    className="w-full max-w-xl border border-gray-300 shadow-md bg-white p-4 rounded-md mb-4 cursor-pointer hover:bg-gray-50 transition"
                >
                    <div className="flex items-center gap-2">
                        <File />
                        <p
                            className="font-bold truncate"
                            title={individualDocument.filename}
                        >
                            {individualDocument.filename}
                        </p>
                    </div>
                </button>
            ))
        }
    }

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5 mb-15 desktop:mb-0">
            <h1 className="text-3xl font-semibold text-center">{t("documents.title")}</h1>
            <div className="w-[80%] max-w-3xl flex flex-col items-center justify-center">
                {renderContent()}
            </div>

        </main>
    );
};

export default DocumentsPage;