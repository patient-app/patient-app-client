"use client";

import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export default function ExerciseImage({exerciseId, pictureId, alt, onError}: Readonly<{
    exerciseId: string,
    pictureId: string,
    alt: string,
    onError?: (error: string) => void
}>) {
    const [src, setSrc] = useState<string | null>(null);
    const {t} = useTranslation();


    useEffect(() => {
        const fetchImage = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: {"Content-Type": "image/png"},
                }
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${exerciseId}/${pictureId}`,
                    requestInit
                )
                if (!response.ok) {
                    const errorData = await response.json();
                    const msg = t("exercise.image.error.fetchFailed") + errorData.message;
                    onError?.(msg);
                    console.error(msg);
                } else {
                    const imageBlob = await response.blob();
                    const imageURL = URL.createObjectURL(imageBlob);
                    setSrc(imageURL)
                }
            } catch (e) {
                const msg = t("exercise.image.error.fetchFailed") + e;
                onError?.(msg);
                console.error(msg);
            }
        }
        fetchImage();
    }, [exerciseId, onError, pictureId, t]);

    return src ? (
        <img
            src={src}
            alt={alt}
            className="my-4 max-w-full h-auto"
        />
    ) : null;


}