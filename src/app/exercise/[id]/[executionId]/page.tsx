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

    const [timerHours, setTimerHours] = useState(0);
    const [timerMinutes, setTimerMinutes] = useState(0);
    const [timerSeconds, setTimerSeconds] = useState(0);
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
            <div className="relative w-full flex items-center justify-center mb-3">
                <ArrowLeft
                    onClick={() => setBackModal(true)}
                    className="absolute left-0 text-gray-500 text-xl cursor-pointer"
                />
                <h1 className="text-3xl font-semibold text-center">SOME HEADER</h1>
                <button
                    className="absolute top-0 right-0 flex flex-col items-center justify-center cursor-pointer gap-1 hover:bg-gray-100 rounded p-2"
                    onClick={() => setFeedbackModal(true)}
                >
                    <MessageSquareShare size={30} strokeWidth={1.75}/>
                    <div className="text-xs font-medium text-center leading-tight">
                        {("feedback for coach").split(" ").map((word: string, idx: number) => (
                            <span key={idx} className="block">{word}</span>
                        ))}
                    </div>
                </button>
            </div>

            <div className="w-full flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium text-gray-700">Set Timer:</label>
                <div className="flex gap-2">
                    <input
                        type="number"
                        min="0"
                        value={timerHours}
                        onChange={(e) => setTimerHours(parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded text-center"
                        placeholder="HH"
                    />
                    <span className="self-center">:</span>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={timerMinutes}
                        onChange={(e) => setTimerMinutes(parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded text-center"
                        placeholder="MM"
                    />
                    <span className="self-center">:</span>
                    <input
                        type="number"
                        min="0"
                        max="59"
                        value={timerSeconds}
                        onChange={(e) => setTimerSeconds(parseInt(e.target.value))}
                        className="w-16 p-2 border border-gray-300 rounded text-center"
                        placeholder="SS"
                    />
                    <Button
                        className="ml-4"
                        disabled={isTimerRunning}
                        onClick={() => {
                            const totalSeconds =
                                timerHours * 3600 + timerMinutes * 60 + timerSeconds;
                            if (totalSeconds > 0) {
                                setTimeLeft(totalSeconds);
                                setIsTimerRunning(true);
                            }
                        }}
                    >
                        Start
                    </Button>
                </div>
                {isTimerRunning && (
                    <div className="mt-2 text-green-700 font-semibold">
                        Time left: {Math.floor(timeLeft! / 3600)
                        .toString()
                        .padStart(2, '0')}
                        :
                        {Math.floor((timeLeft! % 3600) / 60)
                            .toString()
                            .padStart(2, '0')}
                        :
                        {(timeLeft! % 60)
                            .toString()
                            .padStart(2, '0')}
                    </div>
                )}
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
                onClick={() => setMoodAfterModal(prev => !prev)}
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
                        <input
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Please provide your feedback here..." //TODO
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                        />
                        <div className="flex justify-center gap-4">
                            <Button className="bg-blue-600" onClick={() => setFeedbackModal(false)}>
                                {t('exercise.modal.saveButton')}
                            </Button>
                            <Button color="alternative" onClick={() => {
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
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <h3 className="mb-5 text-lg font-semibold text-gray-700">
                            Times up!
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Your timer has completed.
                        </p>
                        <div className="flex justify-center">
                            <Button onClick={() => setTimerFinishedModal(false)}>
                                OK
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>

        </div>
    );

};

export default ExerciseExecutionInfoPage;
