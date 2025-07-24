import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";

export default function ExerciseYoutube({
                                            component,
                                        }: Readonly<{
    component: ExerciseComponentsDTO;
}>) {

    return (
        <div className="my-4 w-full flex flex-col items-center gap-2">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}
            <iframe
                title={component.exerciseComponentDescription}
                src={component.youtubeUrl}
                className="desktop:w-[60%] aspect-video">
            </iframe>
        </div>
    );
}