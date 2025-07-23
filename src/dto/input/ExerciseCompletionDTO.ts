import {MoodDTO} from "@/dto/input/MoodDTO";

export interface ExerciseCompletionDTO {
    exerciseExecutionId: string;
    startTime: string;
    endTime: string;
    feedback: string;
    moodsBefore: MoodDTO[];
    moodsAfter: MoodDTO[];
}
