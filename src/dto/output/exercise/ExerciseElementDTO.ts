import {TextDTO} from "@/dto/output/exercise/TextDTO";
import { InputFieldPrivateDTO } from "./InputFieldPrivateDTO";
import {InputFieldSharedDTO} from "@/dto/output/exercise/InputFieldSharedDTO";
import {FileDTO} from "@/dto/output/exercise/FileDTO";
import {ImageDTO} from "@/dto/output/exercise/ImageDTO";
import {YoutubeDTO} from "@/dto/output/exercise/YoutubeDTO";

type ElementData = TextDTO | InputFieldPrivateDTO | InputFieldSharedDTO | FileDTO | ImageDTO |YoutubeDTO;

export interface ExerciseElementDTO {
    id: string;
    type: string;
    data: ElementData;
}
