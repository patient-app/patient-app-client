"use client";

import React from "react";
import {Check} from "lucide-react";

const question_style = "block text-gray-700 mb-1 font-semibold"

const title = "GAD-7"
const description = "Over the last 2 weeks, how often have you been bothered by the following problems?"
const questions: string[] = ["Feeling nervous, anxious or on edge", "Not being able to stop or control worrying", "Worrying too much about different things", "Trouble relaxing", "Being so restless that it is hard to sit still", "Becoming easily annoyed or irritable", "Feeling afraid as if something awful might happen"];
const questions_and_scores: {question: string, score: number}[] = [{"question": "asidj", "score": 1}]; // TODO

const Questionnaires = () => {

    const submitTest = async () => {
        console.log("Submitting test");
        const requestInit: RequestInit = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                name: title,
                description: description,
                questions: questions_and_scores // TODO
            }),
            headers: {"Content-Type": "application/json"},
        };
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/patients/tests", requestInit);
        console.log(response);
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
                                className="accent-blue-500 w-5 h-5 cursor-pointer"
                            />
                            Not at all
                        </label>
                        <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value="1"
                                className="accent-blue-500 w-5 h-5 cursor-pointer"
                            />
                            Several days
                        </label>
                        <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value="2"
                                className="accent-blue-500 w-5 h-5 cursor-pointer"
                            />
                            More than half the days
                        </label>
                        <label className="flex flex-col items-center gap-1 text-sm cursor-pointer">
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value="3"
                                className="accent-blue-500 w-5 h-5 cursor-pointer"
                            />
                            Nearly every day
                        </label>
                    </div>

                    <hr className="w-[50%] border-gray-300 border-1 my-2" />
                </React.Fragment>
            ))}

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
