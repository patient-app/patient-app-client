"use client";

import { ExerciseComponentsDTO } from "@/dto/output/exercise/ExerciseComponentsDTO";

export default function ExerciseFile({
                                         component,
                                         onError,
                                     }: Readonly<{
    component: ExerciseComponentsDTO;
    onError?: (error: string) => void;
}>) {

    if (!component.fileData || !component.fileType || !component.fileName) {
        onError?.("Invalid file data");
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
                <p className="text-lg text-gray-700 mb-2">
                    {component.exerciseComponentDescription}
                </p>
            )}

            {component.fileType === "application/pdf" ? (
                <iframe
                    src={fileSrc}
                    className="w-full h-[500px] rounded border"
                    title={component.fileName}
                />
            ) : (
                <p className="text-gray-500 mb-2">
                    Preview not available for this file type.
                </p>
            )}

            <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Download {component.fileName}
            </button>
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
