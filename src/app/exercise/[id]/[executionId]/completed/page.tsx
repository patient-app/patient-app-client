"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {ExerciseDTO} from "@/dto/output/exercise/ExerciseDTO";
import {useTranslation} from "react-i18next";
import {ArrowLeft} from "lucide-react";
import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import ExerciseText from "@/components/exerciseComponents/ExerciseText";
import ExerciseInputField from "@/components/exerciseComponents/ExerciseInputField";
import ExerciseImage from "@/components/exerciseComponents/ExerciseImage";
import ExerciseYoutube from "@/components/exerciseComponents/ExerciseYoutube";
import ExerciseFile from "@/components/exerciseComponents/ExerciseFile";


const ExerciseCompletionInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const executionId = params.executionId as string;
    const {t} = useTranslation();

    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDTO | null>(null);

    const handleComponentError = (message: string) => {
        setError(message);
    };

    useEffect(() => {
        const getExercise = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include"
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${id}/execution-information/${executionId}`,
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(t('exercise.error.fetchFailedIndividual') + `: ${errorData.message}`);
                } else {
                    const exerciseData: ExerciseDTO = await response.json();
                    setExercise(exerciseData);
                    console.log("Exercise data:", exerciseData);
                }
            } catch (e) {
                setError(t('exercise.error.fetchFailedIndividual'));
                console.error("Failed to fetch exercise", e);
            }
        };

        getExercise();
    }, [id, t]);


    const renderElement = (element: ExerciseComponentsDTO) => {
        switch (element.exerciseComponentType) {
            case "TEXT": {
                return (
                    <ExerciseText
                        description={{text: element.exerciseComponentDescription ?? ""}}/>
                )
            }
            case "INPUT_FIELD_SHARED":
            case "INPUT_FIELD_PRIVATE": {
                return (
                    <ExerciseInputField
                        exerciseId={id}
                        exerciseExecutionId={executionId}
                        elementId={element.id}
                        component={element}
                        onError={handleComponentError}
                        readonly={true}
                    />
                );
            }
            case "IMAGE": {
                return (
                    <ExerciseImage
                        component={element}
                        onError={handleComponentError}
                    />
                );
            }
            case "YOUTUBE_VIDEO": {
                return (
                    <ExerciseYoutube
                        component={element}
                    />
                )
            }
            case "FILE": {
                return (
                    <ExerciseFile
                        component={element}
                        onError={handleComponentError}
                    />
                )

            }
            default:
                return null;
        }
    }


    return (
        <div className="flex flex-col items-center justify-center w-full gap-5 p-5 ">
            <div className="relative w-full flex items-center justify-center mb-3">
                <ArrowLeft
                    onClick={() => router.push(`/exercise/${id}`)}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center">{exercise?.exerciseTitle}</h1>
            </div>

            <hr className="w-[100%] border-gray-300 border-1 my-2"/>


            {exercise && exercise.exerciseComponents && (
                <div className="w-full flex flex-col gap-4">
                    {exercise.exerciseComponents
                        .slice()
                        .sort((a, b) => a.orderNumber - b.orderNumber)
                        .map((component) => (
                            <React.Fragment key={component.id}>
                                {renderElement(component)}
                                <hr className="w-[100%] border-gray-300 border-1 my-2"/>
                            </React.Fragment>
                        ))}
                </div>
            )}

            {error && (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}


        </div>
    );

};

export default ExerciseCompletionInfoPage;
