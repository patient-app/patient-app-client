"use client";

import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import {useTranslation} from "react-i18next";
import React from "react";

export default function ExerciseFile({
                                         component,
                                         onError,
                                     }: Readonly<{
    component: ExerciseComponentsDTO;
    onError?: (error: string) => void;
}>) {
    const {t} = useTranslation();
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!component.fileData || !component.fileType || !component.fileName) {
        onError?.(t("exerciseFile.error.dataMissing"));
        return null;
    }

    const fileSrc = `data:${component.fileType};base64,${component.fileData}`;

    const handleDownload = () => {
        const blob = b64toBlob(component.fileData!, component.fileType!);
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = component.fileName!;
        link.click();
        URL.revokeObjectURL(url);
    };

    let filePreview;
    if (component.fileType === "application/pdf") {
        if (isMobile) {
            filePreview = (
                <p className="text-center text-gray-500 my-6">
                    {t("individualDocument.noPreviewMobile")}
                    <br/>
                    <a
                        href={fileSrc}
                        className="text-blue-600 underline break-words"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {t("individualDocument.openPdf")}
                    </a>
                </p>
            );
        } else {
            filePreview = (
                <iframe
                    src={fileSrc}
                    className="w-full h-[60vh] desktop:h-[80vh] my-6"
                    title={component.fileName}
                />
            );
        }
    } else {
        filePreview = (
            <p className="text-gray-500 text-center mb-2">
                {t("exerciseFile.noPreview")}
            </p>
        );
    }

    return (
        <div className="my-4 w-full">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}

            {filePreview}

            <div className="flex justify-center mt-4">
                <button
                    onClick={handleDownload}
                    title={component.fileName}
                    className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center gap-2 cursor-pointer min-w-0"
                >
                    <span className="truncate block max-w-[12rem]">
                        {t("exerciseFile.download")} {component.fileName}
                    </span>
                </button>
            </div>

        </div>
    );
}

// Helper: Convert base64 to Blob
function b64toBlob(b64Data: string, contentType = "", sliceSize = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);

        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}
