import {  IsEmail, IsNotEmpty,IsString, MinLength } from 'class-validator'

export class LoginDto {

    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Invalid email format' })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password name format' })
    @MinLength(8, { message: 'Minimum password of 8 characters' })
    password: string

    /* @IsNotEmpty({ message: 'CategoryId is required' })
    @IsUUID('4', { message: 'Invalid categoryId format' })
    categoryId: string */
}