"use client";

import {useRouter} from "next/navigation";

const Exercise = () => {
    const router = useRouter();

    const handleExerciseClick = (exerciseId: number) => {
        router.push('/exercise/' + exerciseId);
    }

    return (
        <div className="gap-4 p-4 flex flex-wrap justify-start">
                {Array.from({length: 5}).map((_, index) => (
                    <button
                        key={index}
                        className="w-26 h-24 bg-blue-figma shadow-md rounded-[20px] hover:bg-medium-blue-figma transition cursor-pointer"
                        onClick={()=>handleExerciseClick(index)}
                    >
                        <p className="font-semibold">Exercise</p>
                    </button>
                ))}
        </div>
    );
};

export default Exercise;