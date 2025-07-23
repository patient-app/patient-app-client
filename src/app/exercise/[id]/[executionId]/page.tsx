"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import {ExerciseDTO} from "@/dto/output/exercise/ExerciseDTO";
import {useTranslation} from "react-i18next";
import ExerciseChatbot from "@/chatbot/exercise/ExerciseChatbot";
import {ExerciseCompletionDTO} from "@/dto/input/ExerciseCompletionDTO";
import {ArrowLeft} from "lucide-react";
import {MoodDTO} from "@/dto/input/MoodDTO";
import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import ExerciseText from "@/components/exerciseComponents/ExerciseText";
import ExerciseInputField from "@/components/exerciseComponents/ExerciseInputField";
import ExerciseImage from "@/components/exerciseComponents/ExerciseImage";
import ExerciseYoutube from "@/components/exerciseComponents/ExerciseYoutube";
import ExerciseFile from "@/components/exerciseComponents/ExerciseFile";
import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";


const ExerciseExecutionInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const executionId = params.executionId as string;
    const [backModal, setBackModal] = useState(false);

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
                    setError(t('exercise.error.fetchFailedIndividual') + `: ${errorData.message}`); //TODO
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
            <div className="relative w-full flex items-center justify-center">
                <ArrowLeft
                    onClick={() => setBackModal(true)}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center">SOME HEADER</h1>
            </div>

            {exercise && exercise.exerciseComponents && (
                <div className="w-full flex flex-col gap-4">
                    {exercise.exerciseComponents
                        .slice()
                        .sort((a, b) => a.orderNumber - b.orderNumber)
                        .map((component) => (
                            <React.Fragment key={component.id}>
                                {renderElement(component)}
                            </React.Fragment>
                        ))}
                </div>
            )}

            {error && (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}

            <button
                onClick={endExercise}
                className="mt-10 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
            >
                Complete Exercise
            </button>

            <HelpButton chatbot={
                <ExerciseChatbot
                    isOpen={false}
                    onCloseAction={() => {
                    }}
                />
            }/>
            <Modal
                show={backModal}
                onClose={() => setBackModal(false)}
                size="md"
                popup
            >
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-700">
                            Some text here about leaving the page
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button color="red" onClick={() => router.back()}>
                                Leave Page
                            </Button>
                            <Button color="alternative" onClick={() => setBackModal(false)}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );

};

export default ExerciseExecutionInfoPage;
