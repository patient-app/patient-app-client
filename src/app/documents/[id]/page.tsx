"use client";

import {useTranslation} from "react-i18next";
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";

const IndividualDocumentPage = () => {
    const {t} = useTranslation();

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
                    const contentDisposition = response.headers.get("content-disposition");
                    const match = contentDisposition?.match(/filename="(.+)"/);
                    const extractedFileName = match?.[1] ?? "downloaded_file.docx"; //TODO: nofilename handling
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
            <h1 className="text-3xl font-semibold text-center">{fileName}</h1>
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
        </>
    );
};

export default IndividualDocumentPage;