import { ImageDTO } from "./ImageDTO";
import { InputDTO } from "./InputDTO";
import { PdfDTO } from "./PdfDTO";

type ElementData = ImageDTO | InputDTO | PdfDTO;

export interface ExerciseElementDTO {
    id: string;
    type: string;
    data: ElementData;
}
