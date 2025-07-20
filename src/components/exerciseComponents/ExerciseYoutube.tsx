import {YoutubeDTO} from "@/dto/output/exercise/YoutubeDTO";

export default function ExerciseYoutube({
                                              elementId,
                                              data,
                                          }: Readonly<{
    elementId: string;
    data: YoutubeDTO;
}>) {

    return (
        <div className="my-4 w-full">
            <iframe
            src="https://www.youtube.com/embed/tgbNymZ7vqY"> //TODO: add actual video URL from data

            </iframe>
        </div>
    );
}