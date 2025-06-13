"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

const documentIcon = (
    <svg xmlns="http://www.w3.org/2000/svg"
         width="32"
         height="32"
         viewBox="0 0 24 24"
         fill="none"
         stroke="currentColor"
         strokeWidth="2"
         strokeLinecap="round"
         strokeLinejoin="round"
         className="lucide lucide-file-icon lucide-file">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    </svg>
);

export default function ExerciseDocument({
                                             exerciseId,
                                             documentId,
                                             name,
                                             onError,
                                         }: Readonly<{
    exerciseId: string;
    documentId: string;
    name: string;
    onError?: (error: string) => void;
}>) {
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const {t} = useTranslation();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: {"Content-Type": "application/pdf"},
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${exerciseId}/documents/${documentId}`,
                    requestInit
                );

                if (!response.ok) {
                    const errorData = await response.json();
                    const msg = t("exercise.document.error.fetchFailed") + errorData.message;
                    onError?.(msg);
                    console.error(msg);
                    return;
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } catch (e) {
                const msg = t("exercise.document.error.fetchFailed") + e;
                onError?.(msg);
                console.error(msg);
            }
        };

        fetchDocument();

        return () => {
            if (pdfUrl) {
                URL.revokeObjectURL(pdfUrl);
            }
        };
    }, [exerciseId, documentId, onError]);

    return (
        <div
            className="w-full flex items-center space-x-4 p-4 border border-gray-200 rounded-md shadow-sm mt-4">
            <div className="mr-4">
                {documentIcon}
            </div>
            <div className="flex-1">
                <p>
                    {name}
                </p>
                {pdfUrl ? (
                    <div className="flex space-x-4 mt-1">
                        <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                        >
                            {t("exercise.document.view")}
                        </a>
                        <a
                            href={pdfUrl}
                            download={name}
                            className="text-blue-600"
                        >
                            {t("exercise.document.download")}
                        </a>
                    </div>
                ) : null
                }
            </div>
        </div>
    );
}
