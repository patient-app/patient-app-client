"use client";

import React, { useState } from "react";
import {Check} from "lucide-react";
import {useRouter} from "next/navigation";

const question_style = "block text-gray-700 mb-1 font-semibold"

const title = "GAD-7"
const description = "Over the last 2 weeks, how often have you been bothered by the following problems?"
const questions: string[] = ["Feeling nervous, anxious or on edge", "Not being able to stop or control worrying", "Worrying too much about different things", "Trouble relaxing", "Being so restless that it is hard to sit still", "Becoming easily annoyed or irritable", "Feeling afraid as if something awful might happen"];

const Questionnaires = () => {
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
                name: title,
                description: description,
                questions: questions_and_scores
            }),
            headers: {"Content-Type": "application/json"},
        };

        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/tests", requestInit);
        console.log(response);
        router.push("/questionnaires");
    }

    return (
        <main className="flex flex-col items-center justify-center w-full gap-5 p-5">
            <h1 className="text-3xl font-semibold text-center">
                {title}
            </h1>

            <p className="block font-semibold text-gray-700 mb-1">
                {description}
            </p>

            <hr className="w-[50%] border-gray-300 border-1 my-2" />

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
                            Not at all
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
                            Several days
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
                            More than half the days
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
                            Nearly every day
                        </label>
                    </div>

                    <hr className="w-[50%] border-gray-300 border-1 my-2" />
                </React.Fragment>
            ))}

            {errorMessage && (
                <div className="w-[50%] mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm text-center">
                    {errorMessage}
                </div>
            )}

            <button
                onClick={() => submitTest()}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition flex items-center gap-2 cursor-pointer"
            >
                Submit <Check size={16} strokeWidth={3} />
            </button>

        </main>
    );
};

export default Questionnaires;
