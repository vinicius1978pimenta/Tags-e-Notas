import { IsString } from "class-validator";

export class CreateDto {
    @IsString()
    name: string;
    @IsString()
    email: string;
    @IsString()
    password: string;
    @IsString()
    confirmPassword: string;
    
}
