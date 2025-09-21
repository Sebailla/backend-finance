import { PartialType } from "@nestjs/mapped-types";
import { LoginDto } from "./login.dto";
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class UpdateCurrentPassDto extends PartialType(LoginDto) {

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password name format' })
    current_password: string

    @IsNotEmpty({ message: 'Password is required' })
        @IsString({ message: 'Password name format' })
        @MinLength(8, { message: 'Minimum password of 8 characters' })
        @MaxLength(50)
        @Matches(
            /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
            message: 'The password must have a Uppercase, lowercase letter and a number'
        })
    new_password: string

}