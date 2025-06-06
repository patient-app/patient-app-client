"use client";

import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import HelpButton from "@/components/HelpButton";

const ExerciseDetailPage = () => {
    const params = useParams();
    const id = params?.id;

    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const getExercise = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                }
                const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + `/patients/exercises/${id}`, requestInit);
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Error fetching exercise: ${errorData.message}`); //TODO: add translation
                } else {
                    const exerciseData = await response.json();
                    console.log("Exercise data:", exerciseData);
                }
            } catch (e) {
                setError(`Error fetching exercise: ${e}`); //TODO: add translation
                console.error("Failed to fetch exercise", e);
            }
        };
        getExercise();
    });


    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Exercise {id}</h1>
            {error && (
                <div
                    className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}
            <HelpButton/>

        </div>
    );
};

export default ExerciseDetailPage;
