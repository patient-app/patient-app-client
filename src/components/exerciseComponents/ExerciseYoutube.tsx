import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";

export default function ExerciseYoutube({
                                            component,
                                        }: Readonly<{
    component: ExerciseComponentsDTO;
}>) {

    return (
        <div className="my-4 w-full flex flex-col items-center gap-2">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-gray-700 text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}
            <iframe
                title={component.exerciseComponentDescription}
                src="https://www.youtube.com/embed/tgbNymZ7vqY"
                className="w-full aspect-video">
            </iframe>
        </div>
    );
}