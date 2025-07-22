import { ExerciseComponentsDTO } from './ExerciseComponentsDTO';

export interface ExerciseDTO {
    exerciseExecutionId: string;
    exerciseTitle: string;
    exerciseDescription: string;
    exerciseElements: ExerciseComponentsDTO[];
}