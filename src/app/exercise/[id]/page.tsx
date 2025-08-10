"use client";

import {useParams, useRouter, useSearchParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import {useTranslation} from "react-i18next";
import ExerciseChatbot from "@/chatbot/exercise/ExerciseChatbot";
import {IndividualExerciseOverviewDTO} from "@/dto/output/exercise/IndividualExerciseOverviewDTO";
import {ArrowLeft, Play} from "lucide-react";
import {BASE_PATH} from "@/libs/constants";
import ErrorComponent from "@/components/ErrorComponent";

const ExerciseDetailPage = () => {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const id = params?.id;
    const title = searchParams.get('title');

    const [error, setError] = useState<string | null>(null);
    const [exercises, setExercises] = useState<IndividualExerciseOverviewDTO[]>([]);

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
                    const exercisesResponse = await response.json();
                    setExercises(exercisesResponse);
                    console.log("Exercise data:", exercisesResponse);
                }
            } catch (e) {
                setError(t('exercise.error.fetchFailedIndividual'));
                console.error("Failed to fetch exercise", e);
            }
        };

        getExercise();
    }, [id, t]);

    const startExercise = async () => {
        try {
            const requestInit: RequestInit = {
                method: "POST",
                credentials: "include",
            };
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${id}/start`,
                requestInit
            );
            if (!response.ok) {
                const errorData = await response.json();
                setError(t('exercise.error.startFailed') + `: ${errorData.message}`);
            } else {
                const res = await response.json();
                const exerciseExecutionId = res.exerciseExecutionId;
                router.push(`${BASE_PATH}/exercise/${id}/${exerciseExecutionId}`);
            }
        } catch (e) {
            setError(t('exercise.error.startFailed'));
            console.error("Failed to start exercise", e);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full gap-5 p-5 mb-15 desktop:mb-0">
            <div className="relative w-full flex items-center justify-center">
                <ArrowLeft
                    onClick={() => router.push(`${BASE_PATH}/exercise`)}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center">{title}</h1>
            </div>
            <button
                onClick={startExercise}
                className="mt-10 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
            >
                {t('exercise.start')} <Play size={16}/>
            </button>
            <hr className="w-[50%] border-gray-300 border-1 my-2"/>
            <h2 className="text-xl font-semibold text-gray-800 w-full mb-2 text-center">
                {t('exercise.completedExercise')}
            </h2>

            {exercises
                .toSorted((a, b) => new Date(b.executionTitle).getTime() - new Date(a.executionTitle).getTime())
                .map(exercise => (
                <button
                    key={exercise.exerciseExecutionId}
                    onClick={() => router.push(`${BASE_PATH}/exercise/${id}/${exercise.exerciseExecutionId}/completed`)}
                    className="w-full max-w-xl border text-left border-gray-300 shadow-md bg-white p-4 rounded-md cursor-pointer hover:bg-gray-50 transition"
                >
                    <p className="font-bold">{new Date(exercise.executionTitle).toLocaleString()}</p>
                </button>
            ))}


            <ErrorComponent message={error}/>

            <HelpButton chatbot={<ExerciseChatbot
                onCloseAction={() => {
                }
                }/>
            }/>
        </div>
    );
};

export default ExerciseDetailPage;
