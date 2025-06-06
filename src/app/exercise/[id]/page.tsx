"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import HelpButton from "@/components/HelpButton";
import { ExerciseDTO } from "@/dto/output/ExerciseDTO";

const ExerciseDetailPage = () => {
    const params = useParams();
    const id = params?.id;

    const [error, setError] = useState<string | null>(null);
    const [exercise, setExercise] = useState<ExerciseDTO | null>(null);

    useEffect(() => {
        const getExercise = async () => {
            try {
                const requestInit: RequestInit = {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                };
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/patients/exercises/${id}`,
                    requestInit
                );
                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Error fetching exercise: ${errorData.message}`); // TODO: add translation
                } else {
                    const exerciseData: ExerciseDTO = await response.json();
                    setExercise(exerciseData);
                    console.log("Exercise data:", exerciseData);
                }
            } catch (e) {
                setError(`Error fetching exercise: ${e}`); // TODO: add translation
                console.error("Failed to fetch exercise", e);
            }
        };

        getExercise();
    }, [id]);

    return (
        <div className="p-6">
            {exercise ? (
                <h1 className="text-2xl font-bold">{exercise.title}</h1>
            ) : (
                <h1 className="text-2xl font-bold">No exercise available</h1> //TODO: add translation
            )}

            {error && (
                <div className="w-full mt-2 px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm">
                    {error}
                </div>
            )}

            <HelpButton />
        </div>
    );
};

export default ExerciseDetailPage;
