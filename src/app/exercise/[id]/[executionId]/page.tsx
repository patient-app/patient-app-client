"use client";

import {useParams, useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import HelpButton from "@/components/HelpButton";
import {ExerciseDTO} from "@/dto/output/exercise/ExerciseDTO";
import {useTranslation} from "react-i18next";
import ExerciseChatbot from "@/chatbot/exercise/ExerciseChatbot";
import {ExerciseCompletionDTO} from "@/dto/input/ExerciseCompletionDTO";
import {ArrowLeft, MessageSquareShare} from "lucide-react";
import {MoodDTO} from "@/dto/input/MoodDTO";
import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import ExerciseText from "@/components/exerciseComponents/ExerciseText";
import ExerciseInputField from "@/components/exerciseComponents/ExerciseInputField";
import ExerciseImage from "@/components/exerciseComponents/ExerciseImage";
import ExerciseYoutube from "@/components/exerciseComponents/ExerciseYoutube";
import ExerciseFile from "@/components/exerciseComponents/ExerciseFile";
import {Button, Modal, ModalBody, ModalHeader} from "flowbite-react";
import MoodTracker from "@/components/MoodTracker";
import TimerComponent from "@/components/TimerComponent";
import {BASE_PATH} from "@/libs/constants";


const ExerciseExecutionInfoPage = () => {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const executionId = params.executionId as string;
    const {t} = useTranslation();

    const [backModal, setBackModal] = useState(false);
    const [feedbackModal, setFeedbackModal] = useState(false);
    const [moodBeforeModal, setMoodBeforeModal] = useState(true);
    const [moodAfterModal, setMoodAfterModal] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDTO | null>(null);
    const [moodBefore, setMoodBefore] = useState<MoodDTO>({
        moodName: "neutral",
        moodScore: 3,
    });
    const [moodAfter, setMoodAfter] = useState<MoodDTO>({
        moodName: "neutral",
        moodScore: 3,
    });
    const [feedback, setFeedback] = useState<string>("");
    const [startTime, setStartTime] = useState<string>("");

    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerFinishedModal, setTimerFinishedModal] = useState(false)

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
                }
            } catch (e) {
                setError(t('exercise.error.fetchFailedIndividual'));
                console.error("Failed to fetch exercise", e);
            }
        };

        getExercise();
    }, [id, executionId, t]);

    useEffect(() => {
        setStartTime(new Date().toISOString());
    }, []);

    useEffect(() => {
        if (!isTimerRunning || timeLeft === null) return;

        if (timeLeft <= 0) {
            setIsTimerRunning(false);
            setTimerFinishedModal(true);
            return;
        }

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
        }, 1000);

        return () => clearInterval(interval);
    }, [isTimerRunning, timeLeft]);


    const endExercise = async (finalMood?: MoodDTO) => {
        const completionInformation: ExerciseCompletionDTO = {
            exerciseExecutionId: executionId,
            startTime: startTime,
            endTime: new Date().toISOString(),
            feedback: feedback,
            moodsBefore: [moodBefore],
            moodsAfter: [finalMood ?? moodAfter]
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
                setError(t('exercise.error.endFailed') + `: ${errorData.message}`);
                console.log(errorData.message)
            } else {
                const path = `${BASE_PATH}/exercise/${id}`;
                const query = exercise?.exerciseTitle
                    ? `?title=${encodeURIComponent(exercise.exerciseTitle)}`
                    : "";

                router.push(`${path}${query}`);

            }
        } catch (e) {
            setError(t('exercise.error.endFailed'));
            console.error("Failed to end exercise", e);
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
        <div className="flex flex-col items-center justify-center w-full gap-5 p-5 mb-15 desktop:mb-0">
            <div className="relative w-full flex items-center justify-center mb-3">
                <ArrowLeft
                    onClick={() => setBackModal(true)}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center">{exercise?.exerciseTitle}</h1>
                <button
                    className="absolute top-0 right-0 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                    onClick={() => setFeedbackModal(true)}
                >
                    <MessageSquareShare size={30} strokeWidth={1.75}/>
                    <div className="text-xs font-medium text-center leading-tight">
                        {t("exercise.modal.buttonText").split(" ").map((word: string, idx: number) => (
                            <span key={idx} className="block">{word}</span>
                        ))}
                    </div>
                </button>
            </div>

            <TimerComponent onFinish={() => setTimerFinishedModal(true)}/>
            <hr className="w-full desktop:w-4/5 border-gray-300 border-1 my-2"/>


            {exercise && exercise.exerciseComponents && (
                <div className="w-full desktop:w-4/5 flex flex-col gap-4">
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

            <button
                onClick={() => setMoodAfterModal(prev => !prev)}
                className="mt-10 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
            >
                {t('exercise.completeExecution')}
            </button>

            <HelpButton chatbot={
                <ExerciseChatbot
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
            <Modal
                show={feedbackModal}
                onClose={() => {
                    setFeedback("");
                    setFeedbackModal(false)
                }}
                size="md"
                popup
            >
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-normal text-gray-700">
                            {t('exercise.modal.feedbackText')}
                        </h3>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder={t('exercise.modal.feedbackPlaceholder')}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            rows={2}
                        />
                        <div className="flex justify-center gap-4 mt-4">
                            <Button className="bg-blue-600 cursor-pointer" onClick={() => setFeedbackModal(false)}>
                                {t('exercise.modal.saveButton')}
                            </Button>
                            <Button color="alternative" className="cursor-pointer" onClick={() => {
                                setFeedback("");
                                setFeedbackModal(false)
                            }}>
                                {t('exercise.modal.cancelButton')}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
            <Modal
                show={moodBeforeModal}
                size="md"
                popup
            >
                <MoodTracker
                    moodAction={(mood) => setMoodBefore(mood)}
                    closeAction={() => setMoodBeforeModal(false)}
                />
            </Modal>
            <Modal
                show={moodAfterModal}
                size="md"
                popup
            >
                <MoodTracker
                    moodAction={(mood) => {
                        setMoodAfter(mood);
                        endExercise(mood);
                    }}
                    closeAction={() => setMoodAfterModal(false)}
                />
            </Modal>
            <Modal
                show={timerFinishedModal}
                onClose={() => setTimerFinishedModal(false)}
                size="md"
                popup
            >
                <ModalHeader/>
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-semibold text-gray-700">
                            {t('exercise.modal.timeUpText')}
                        </h3>
                        <div className="flex justify-center gap-4">
                            <Button onClick={() => setTimerFinishedModal(false)}>
                                {t('exercise.modal.okButton')}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    );

};

export default ExerciseExecutionInfoPage;
