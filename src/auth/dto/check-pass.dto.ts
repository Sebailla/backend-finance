
import {  IsNotEmpty,IsString, Matches, MaxLength, MinLength } from 'class-validator'

export class CheckPassDto {

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password name format' })
    password: string
}
