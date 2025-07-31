"use client";

import {useTranslation} from "react-i18next";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import DocumentChatbot from "@/chatbot/document/DocumentChatbot";
import {ArrowLeft} from "lucide-react";

const IndividualDocumentPage = () => {
    const {t} = useTranslation();
    const router = useRouter();
    const params = useParams();
    const id = params.id;

    const [error, setError] = useState<string | null>(null);

    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/documents/${id}`,
                    requestInit
                );

                if (!response.ok) {
                    console.log("Error fetching document: ", response.statusText);
                    setError("individualDocument.error.fetchFailed");
                }

                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setDownloadUrl(url);
                setFileType(blob.type);

                const disposition = response.headers.get("Content-Disposition");
                const match = disposition?.match(/filename="(.+)"/);
                const extractedFileName = match?.[1] ?? "File";
                setFileName(extractedFileName);
            } catch (e) {
                console.error("Failed to fetch document: ", e);
            }
        };

        fetchDocument();
    }, [id]);

    const renderPreview = () => {
        if (!downloadUrl || !fileType) return null;

        if (fileType.startsWith("image/")) {
            return (

                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={downloadUrl}
                    alt={fileName}
                    className="h-auto mx-auto my-6"
                />
            );
        } else if (fileType === "application/pdf") {
            return (
                <iframe
                    src={downloadUrl}
                    title={fileName}
                    className="w-full desktop:w-[80vw] h-[60vh] desktop:h-[70vh] mt-2 mb-2"
                />

            );
        } else {
            return (
                <p className="text-center text-gray-500 my-6">
                    {t("individualDocument.noPreview")}
                </p>
            );
        }
    };

    return (
        <div className="mb-15 desktop:mb-0">
            <ArrowLeft
                onClick={() => router.back()}
                className="text-gray-500 text-xl cursor-pointer"
            />
            <h1 className="text-3xl font-semibold text-center mb-10">{fileName}</h1>
            <div className="flex justify-center">
                {renderPreview()}
            </div>
            <div className="flex justify-center">
                {error && (
                    <div
                        className="mt-2 p-2 text-sm bg-red-100 text-red-700 border border-red-300 rounded w-fit max-w-xs">
                        {error}
                    </div>
                )}
            </div>

            {!error && downloadUrl && (
                <div className="text-center mt-6">
                    <a
                        href={downloadUrl}
                        download={fileName}
                        className="inline-block max-w-xs mt-3 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition cursor-pointer truncate overflow-hidden whitespace-nowrap"
                    >
                        {t("individualDocument.download")}
                    </a>
                </div>
            )}

            <HelpButton
                chatbot={
                    <DocumentChatbot
                        isOpen={false}
                        onCloseAction={() => {
                        }}
                    />
                }
            />
        </div>
    );
};

export default IndividualDocumentPage;
