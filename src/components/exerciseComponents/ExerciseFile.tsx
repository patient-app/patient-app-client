"use client";

import { ExerciseComponentsDTO } from "@/dto/output/exercise/ExerciseComponentsDTO";
import {useTranslation} from "react-i18next";

export default function ExerciseFile({
                                         component,
                                         onError,
                                     }: Readonly<{
    component: ExerciseComponentsDTO;
    onError?: (error: string) => void;
}>) {
    const { t } = useTranslation();

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

    return (
        <div className="my-4 w-full">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}

            {component.fileType === "application/pdf" ? (
                <iframe
                    src={fileSrc}
                    className="w-full h-[60vh] desktop:h-[80vh] my-6"
                    title={component.fileName}
                />
            ) : (
                <p className="text-gray-500 text-center mb-2">
                    {t('exerciseFile.noPreview')}
                </p>
            )}

            <div className="flex justify-center mt-4">
                <button
                    onClick={handleDownload}
                    className="bg-teal-400 text-white px-4 py-2 rounded hover:bg-teal-500 transition flex items-center gap-2 cursor-pointer"
                >
                    {t("exerciseFile.download")} {component.fileName}
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

    return new Blob(byteArrays, { type: contentType });
}
