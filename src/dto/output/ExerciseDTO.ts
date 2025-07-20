import { ExerciseElementDTO } from './exercise/ExerciseElementDTO';

export interface ExerciseDTO {
    exerciseExecutionId: string;
    exerciseTitle: string;
    exerciseDescription: string;
    exerciseElements: ExerciseElementDTO[];
}