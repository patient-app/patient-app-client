import { ExerciseElementDTO } from './exercise/ExerciseElementDTO';

export interface ExerciseDTO {
    id: string;
    title: string;
    description: string;
    elements: ExerciseElementDTO[];
}