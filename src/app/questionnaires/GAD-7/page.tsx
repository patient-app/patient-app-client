"use client";

import React, {useState} from "react";
import {ArrowLeft, Check} from "lucide-react";
import {useRouter} from "next/navigation";
import {useTranslation} from "react-i18next";
import {BASE_PATH} from "@/libs/constants";
import ErrorComponent from "@/components/ErrorComponent";

const question_style = "block text-gray-700 mb-1 font-semibold"

const Questionnaires = () => {
    const {t} = useTranslation();
    const questions: string[] = t("questionnaires.GAD-7.questions", {returnObjects: true});
    const answers: string[] = t("questionnaires.GAD-7.answers", {returnObjects: true});

    const router = useRouter();
    const [selections, setSelections] = useState<number[]>(Array(questions.length).fill(-1));
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Handle radio button selection
    const handleSelection = (questionIndex: number, score: number) => {
        const newSelections = [...selections];
        newSelections[questionIndex] = score;
        setSelections(newSelections);

        if (errorMessage) setErrorMessage("");
    };

    const submitTest = async () => {
        // Check if all questions have been answered
        if (selections.includes(-1)) {
            setErrorMessage("Please answer all questions before submitting.");
            return;
        }

        // Create questions_and_scores array from user selections
        const questions_and_scores = questions.map((question, index) => ({
            question,
            score: selections[index]
        }));

        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name: t("questionnaires.GAD-7.title"),
                description: t("questionnaires.GAD-7.description"),
                questions: questions_and_scores
            }),
            headers: {"Content-Type": "application/json"},
        };

        await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/tests", requestInit);
        router.push(`${BASE_PATH}/questionnaires`);
    }

    return (
        <main className="mb-15 desktop:mb-0">
            <ArrowLeft
                onClick={() => router.back()}
                className="text-gray-500 text-xl cursor-pointer"
            />
            <div className="flex flex-col items-center justify-center w-full gap-5 p-5 ">
                <h1 className="text-3xl font-semibold text-center">
                    {t("questionnaires.GAD-7.title")}
                </h1>

                <p className="block font-semibold text-gray-700 mb-1">
                    {t("questionnaires.GAD-7.description")}
                </p>

                <hr className="w-[50%] border-gray-300 border-1 my-2"/>

                {questions.map((question, index) => (
                    <React.Fragment key={index}>
                        <p className={question_style}>
                            {question}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-2">
                            <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="0"
                                    checked={selections[index] === 0}
                                    onChange={() => handleSelection(index, 0)}
                                    className="accent-blue-500 w-5 h-5 cursor-pointer"
                                />
                                {answers[0] || ""}
                            </label>
                            <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="1"
                                    checked={selections[index] === 1}
                                    onChange={() => handleSelection(index, 1)}
                                    className="accent-blue-500 w-5 h-5 cursor-pointer"
                                />
                                {answers[1] || ""}
                            </label>
                            <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="2"
                                    checked={selections[index] === 2}
                                    onChange={() => handleSelection(index, 2)}
                                    className="accent-blue-500 w-5 h-5 cursor-pointer"
                                />
                                {answers[2] || ""}
                            </label>
                            <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name={`question-${index}`}
                                    value="3"
                                    checked={selections[index] === 3}
                                    onChange={() => handleSelection(index, 3)}
                                    className="accent-blue-500 w-5 h-5 cursor-pointer"
                                />
                                {answers[3] || ""}
                            </label>
                        </div>

                        <hr className="w-[50%] border-gray-300 border-1 my-2"/>
                    </React.Fragment>
                ))}

                <div className="w-[50%]">
                    <ErrorComponent message={errorMessage}/>
                </div>


                <button
                    onClick={() => submitTest()}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
                >
                    {t("questionnaires.submit")} <Check size={16} strokeWidth={3}/>
                </button>
            </div>
        </main>
    );
};

export default Questionnaires;
