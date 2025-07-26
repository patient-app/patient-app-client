import {ExerciseComponentsDTO} from "@/dto/output/exercise/ExerciseComponentsDTO";

export default function ExerciseYoutube({
                                            component,
                                        }: Readonly<{
    component: ExerciseComponentsDTO;
}>) {

    function convertToEmbedUrl(youtubeUrl: string): string {
        const videoIdMatch = RegExp(/v=([a-zA-Z0-9_-]{11})/).exec(youtubeUrl);
        const listIdMatch = RegExp(/list=([^&]+)/).exec(youtubeUrl);


        if (listIdMatch) {
            return `https://www.youtube.com/embed/videoseries?list=${listIdMatch[1]}`;
        }

        if (videoIdMatch) {
            return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
        }

        return youtubeUrl;
    }

    if (!component.youtubeUrl) return null;

    return (
        <div className="my-4 w-full flex flex-col items-center gap-2">
            {component.exerciseComponentDescription && (
                <p className="text-lg text-center">
                    {component.exerciseComponentDescription}
                </p>
            )}
            <iframe
                title={component.exerciseComponentDescription}
                src={convertToEmbedUrl(component.youtubeUrl)}
                className="desktop:w-[60%] aspect-video"
                allowFullScreen
            ></iframe>
        </div>
    );
}
