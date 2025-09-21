import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Invalid name format' })
    name: string

    @IsNotEmpty({ message: 'Lastname is required' })
    @IsString({ message: 'Invalid Lastname format' })
    lastName: string

    @IsNotEmpty({ message: 'Email is required' })
    @IsString({ message: 'Invalid email format' })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: 'Password is required' })
    @IsString({ message: 'Password name format' })
    @MinLength(8, { message: 'Minimum password of 8 characters' })
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string

    @IsString({ message: 'Invalid image link format' })
    @IsOptional()
    image: string

    @IsOptional()
    @IsString({ message: 'Invalid token format' })
    token: string

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    confirmed: boolean

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isActive: boolean
}
