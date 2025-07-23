"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import {ExerciseDTO} from "@/dto/output/exercise/ExerciseDTO";
import {useTranslation} from "react-i18next";
import ExerciseChatbot from "@/components/ExerciseChatbot";
import {ExerciseCompletionDTO} from "@/dto/input/ExerciseCompletionDTO";
import {ArrowLeft} from "lucide-react";
import {MoodDTO} from "@/dto/input/MoodDTO";


const ExerciseExecutionInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params?.id;
    const executionId = params.executionId as string;

    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDTO | null>(null);
    const [moodBefore, setMoodBefore] = useState<MoodDTO>({
        moodName: "neutral",
        moodScore: 0,
    });
    const [moodAfter, setMoodAfter] = useState<MoodDTO>({
        moodName: "neutral",
        moodScore: 0,
    });

    const {t} = useTranslation();

    useEffect(() => {
        const getExercise = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${id}`,
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

    const endExercise = async () => {
        //TODO: remove hardcoded mood values
        setMoodBefore({
            moodName: "neutral",
            moodScore: 0
        })
        setMoodAfter({
            moodName: "happy",
            moodScore: 5
        })
        const completionInformation: ExerciseCompletionDTO = {
            exerciseExecutionId: executionId,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            feedback: "Great exercise!",
            moodsBefore: [moodBefore],
            moodsAfter: [moodAfter]
        };


        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(completionInformation)
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${id}/exercise-completed`,
                requestInit
            );
            if (!response.ok) {
                const errorData = await response.json();
                setError(t('exercise.error.fetchFailedIndividual') + `: ${errorData.message}`); //TODO: correct error message
                console.log(errorData.message)
            } else {
                router.push(`/exercise/${id}`);
            }
        } catch (e) {
            setError(t('exercise.error.fetchFailedIndividual')); //TODO: correct error message
            console.error("Failed to start exercise", e);
        }
    }


    /**const renderElement = (element: ExerciseComponentsDTO) => {
     switch (element.type) {
     case "IMAGE": {
     const data = element.data as ImageDTO;
     return (
     <ExerciseImage
     key={element.id}
     pictureId={element.id}
     exerciseId={id as string}
     alt={data.alt}
     onError={(msg) => setError(msg)}
     />
     );
     }
     case "FILE": {
     const data = element.data as PdfDTO;
     return (
     <ExerciseDocument
     key={element.id}
     exerciseId={id as string}
     documentId={element.id}
     name={data.name}
     onError={(msg) => setError(msg)}
     />
     );
     }
     case "TEXT_INPUT": {
     const data = element.data as InputDTO;
     return (
     <ExerciseTextInput
     key={element.id}
     elementId={element.id}
     data={data}
     />
     );
     }
     default:
     return null;
     }
     }; **/

    return (
        <div className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <div className="relative w-full flex items-center justify-center">
                <ArrowLeft
                    onClick={() => router.back()}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center"></h1>
            </div>
            {error && (
                <div
                    className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}
            <button
                onClick={endExercise}
                className="mt-10 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
            >
                Complete Exercise
            </button>

            <HelpButton chatbot={<ExerciseChatbot
                isOpen={false}
                onCloseAction={() => {
                }
                }/>
            }/>
        </div>
    );
};

export default ExerciseExecutionInfoPage;
