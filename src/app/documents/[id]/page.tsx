"use client";

import {useTranslation} from "react-i18next";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import DocumentChatbot from "@/components/DocumentChatbot";
import {ArrowLeft} from "lucide-react";

const IndividualDocumentPage = () => {
    const {t} = useTranslation();
    const router = useRouter();

    const params = useParams();
    const id = params.id;
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
            const fetchDocument = async () => {
                try {
                    const requestInit: RequestInit = {
                        method: "GET",
                        credentials: "include",
                    };
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/documents/${id}`, requestInit);
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    setDownloadUrl(url);
                    const disposition = response.headers.get('Content-Disposition');
                    const match = disposition?.match(/filename="(.+)"/);
                    const extractedFileName = match?.[1] ?? "File";
                    setFileName(extractedFileName);
                } catch (e) {
                    console.error("Failed to fetch document: ", e);
                }

            };
            fetchDocument();
        }, [id]
    )
    ;


    return (
        <>
            <ArrowLeft
            onClick={() => router.back()}
            className="text-gray-500 text-xl cursor-pointer"
        />
            <h1 className="text-3xl font-semibold text-center mb-10">{fileName}</h1>
            {downloadUrl && (
                <div className="text-center mt-4">
                    <a
                        href={downloadUrl}
                        download={fileName}
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {t("individualDocument.download", {documentName: fileName})}
                    </a>
                </div>
            )}
            <HelpButton chatbot={<DocumentChatbot
                isOpen={false}
                onCloseAction={() => {
                }
                }/>
            }/>
        </>
    );
};

export default IndividualDocumentPage;