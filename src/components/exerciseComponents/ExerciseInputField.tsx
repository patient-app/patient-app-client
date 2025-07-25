"use client";

import {useState} from "react";
import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";
import {Eye, EyeOff} from "lucide-react";
import {Tooltip} from "flowbite-react";
import {useTranslation} from "react-i18next";

export default function ExerciseInputField({
                                               exerciseId,
                                               exerciseExecutionId,
                                               elementId,
                                               component,
                                               onError,
                                               readonly = false,
                                           }: Readonly<{
    exerciseId: string;
    exerciseExecutionId: string;
    elementId: string;
    component: ExerciseComponentsDTO;
    onError?: (errorMessage: string) => void;
    readonly?: boolean;
}>) {
    const [input, setInput] = useState(component.userInput ?? "");
    const {t} = useTranslation();

    const updateExerciseComponent = async () => {
        if (readonly) return;

        try {
            const requestInit: RequestInit = {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    exerciseExecutionId: exerciseExecutionId,
                    userInput: input,
                }),
            };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${exerciseId}/exercise-components/${elementId}`,
                requestInit
            );

            if (!response.ok) {
                const errorData = await response.json();
                const errorMsg = t('exerciseInput.error.failedToUpdate') + `: ${errorData.message}`;
                onError?.(errorMsg);
            }
        } catch (e) {
            const errorMsg = t('exerciseInput.error.failedToUpdate');
            onError?.(errorMsg);
            console.error("Failed to update exercise", e);
        }
    };

    return (
        <div className="my-4 w-full">
            <label htmlFor={elementId} className="block font-medium mb-1">
                {component.exerciseComponentDescription}
            </label>
            <div className="relative w-full">
                <textarea
                    id={elementId}
                    value={readonly ? (component.userInput ?? " ") : input}
                    onChange={(e) => !readonly && setInput(e.target.value)}
                    onBlur={!readonly ? updateExerciseComponent : undefined}
                    placeholder={t('exerciseInput.placeholder')}
                    disabled={readonly}
                    required={!readonly}
                    rows={2}
                    onInput={(e) => {
                        e.currentTarget.style.height = "auto";
                        e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
                    }}
                    className={`block w-full resize-none overflow-hidden ${
                        readonly ? "bg-gray-100 text-gray-600" : "bg-green-100"
                    } rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 pr-10`}
                />
                <div className="absolute top-2 right-2">
                    <Tooltip
                        content={
                            component.exerciseComponentType === "INPUT_FIELD_SHARED"
                                ? t('exerciseInput.tooltip.sharedWithCoach')
                                : t('exerciseInput.tooltip.private')
                        }
                        placement="top"
                    >
                        {component.exerciseComponentType === "INPUT_FIELD_SHARED" ? (
                            <Eye className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20}/>
                        ) : (
                            <EyeOff className="text-gray-400 hover:text-gray-600 cursor-pointer" size={20}/>
                        )}
                    </Tooltip>
                </div>
            </div>
        </div>
    );
}
