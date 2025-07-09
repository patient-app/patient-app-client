"use client";

import {useParams} from "next/navigation";
import {useState, useEffect} from "react";
import HelpButton from "@/components/HelpButton";
import {ExerciseDTO} from "@/dto/output/ExerciseDTO";
import {ExerciseElementDTO} from "@/dto/output/exercise/ExerciseElementDTO";
import {ImageDTO} from "@/dto/output/exercise/ImageDTO";
import {PdfDTO} from "@/dto/output/exercise/PdfDTO";
import {InputDTO} from "@/dto/output/exercise/InputDTO";
import ExerciseImage from "@/components/ExerciseImage";
import ExerciseDocument from "@/components/ExerciseDocument";
import ExerciseTextInput from "@/components/ExerciseTextInput";

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
                    headers: {"Content-Type": "application/json"},
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


    const renderElement = (element: ExerciseElementDTO) => {
        switch (element.type) {
            case "IMAGE": {
                const data = element.data as ImageDTO;
                return (
                    <ExerciseImage
                        key={element.id}
                        pictureId={element.id}
                        exerciseId={id as string}
                        alt={data.alt}
                        onError={(msg) => setError(msg)}
                    />
                );
            }
            case "FILE": {
                const data = element.data as PdfDTO;
                return (
                    <ExerciseDocument
                        key={element.id}
                        exerciseId={id as string}
                        documentId={element.id}
                        name={data.name}
                        onError={(msg) => setError(msg)}
                    />
                );
            }
            case "TEXT_INPUT": {
                const data = element.data as InputDTO;
                return (
                    <ExerciseTextInput
                        key={element.id}
                        elementId={element.id}
                        data={data}
                    />
                );
            }
            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-start">
            {exercise ? (
                <>
                    <h1 className="text-3xl font-semibold text-center">{exercise.title}</h1>
                    <p className="pt-6">{exercise.description}</p>
                    <div className="w-full max-w-2xl mt-6">
                        {exercise.exerciseElements.map(renderElement)}
                    </div>
                </>
            ) : (
                <h1 className="text-3xl font-semibold text-center">No exercise available</h1> //TODO: add translation
            )}


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
