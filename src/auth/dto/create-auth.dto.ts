import { Type } from 'class-transformer'
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class CreateAuthDto {

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

    /* @IsNotEmpty({ message: 'CategoryId is required' })
    @IsUUID('4', { message: 'Invalid categoryId format' })
    categoryId: string */
}
