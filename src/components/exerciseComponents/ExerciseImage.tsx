"use client";

import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import {useTranslation} from "react-i18next";

export default function ExerciseImage({component, onError}: Readonly<{
    component: ExerciseComponentsDTO;
    onError: (error: string) => void
}>) {
    const {t} = useTranslation();

    if (!component.fileData || !component.fileType) {
        onError(t("exercise.error.imageMissing"));
        return null;
    }


    const imageSrc = `data:${component.fileType};base64,${component.fileData}`;

    return (
        <div className="my-4 w-full flex flex-col items-center gap-2">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={imageSrc}
                alt={component.exerciseComponentDescription ?? t("exerciseImage.exerciseComponentDescription")}
                className="max-w-full h-auto"
                onError={() => onError(t("exercise.error.imageLoadFailed"))}
            />
        </div>
    );


}