"use client";

import { useParams } from "next/navigation";

const ExerciseDetailPage = () => {
    const params = useParams();
    const id = params?.id;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Exercise {id}</h1>
        </div>
    );
};

export default ExerciseDetailPage;
