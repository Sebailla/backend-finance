import { PartialType } from "@nestjs/mapped-types";
import { LoginDto } from "./login.dto";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdatePassDto extends PartialType(LoginDto) {

    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Invalid email format' })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password name format' })
    @MinLength(8, { message: 'Minimum password of 8 characters' })
    password: string

}