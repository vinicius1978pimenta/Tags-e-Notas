import { IsString } from "class-validator";

export class NotesCreateDto {
    @IsString()
    id?: string;
    @IsString()
    title: string;
    @IsString()
    content: string;
    @IsString()
    tags: string[];
}
