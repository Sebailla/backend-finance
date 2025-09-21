import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEmail, comparePassword, generateToken, hashPassword, JwtPayload, LoginDto, UpdatePassDto } from 'src';

import colors from 'colors'
import { User } from './entities/auth.entity';
import { JwtService } from '@nestjs/jwt';
import { UpdateCurrentPassDto } from './dto/update-current-pass.dto';
import { CheckPassDto } from './dto/check-pass.dto';


//Nest console loggs
const logger = new Logger('AuthService')

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto) {

    try {

      const existeUser = await this.userRepository.findOne({
        where: {
          email: createUserDto.email
        }
      })

      if (existeUser) {
        throw new ConflictException('User already exists')
      }

      const { password, token, ...userData } = createUserDto
      const newUser = this.userRepository.create({
        ...userData,
        password: await hashPassword(password),
        token: generateToken()
      })

      const user = await this.userRepository.save(newUser)

      await AuthEmail.sendConfirmationEmail({
        name: newUser.name,
        email: newUser.email,
        token: newUser.token
      })

      return {
        message: 'User created successfully',
        user
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }

  }

  async confirmAccount(updateUserDto: UpdateUserDto) {

    try {
      const token = updateUserDto.token
      const user = await this.userRepository.findOne({
        where: {
          token
        }
      })
      if (!user) {
        throw new UnauthorizedException('Invalid token')
      }

      user.confirmed = true
      user.isActive = true
      user.token = 'null'
      await this.userRepository.save(user)

      return {
        message: 'Account confirmed successfully, redirect to Login'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }
  }

  async login(loginDto: LoginDto) {

    try {

      const user = await this.userRepository.findOne({
        where: {
          email: loginDto.email
        }
      })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      if (!user.confirmed) {
        throw new ForbiddenException('Unconfirmed account')
      }

      const existPassword = await comparePassword(loginDto.password, user.password)

      if (!existPassword) {
        throw new UnauthorizedException('Invalid password')
      }

      const token = this.generateJwt({ id: user.id })

      return {
        message: 'Login successfully',
        ...user,
        token: token
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }

  }

  async forgotPassword(updatePassDto: UpdatePassDto) {

    try {

      const user = await this.userRepository.findOne({
        where: {
          email: updatePassDto.email
        }
      })


      if (!user) {
        throw new NotFoundException('User not found')
      }

      if (user.isActive !== true) {
        throw new ForbiddenException('Inactive User')
      }

      user.token = generateToken()
      await this.userRepository.save(user)

      await AuthEmail.sendForgotPasswordEmail({
        name: user.name,
        email: user.email,
        token: user.token
      })

      return {
        message: 'Email sent successfully'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }

  }

  async validateToken(updateUserDto: UpdateUserDto) {

    try {

      const existsToken = await this.userRepository.findOne({
        where: {
          token: updateUserDto.token
        }
      })

      if (!existsToken) {
        throw new UnauthorizedException('Invalid token')
      }

      return {
        message: 'Token is valid. Assign a new password'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }
  }

  async resetPasswordWithToken(token: string, updateUserDto: UpdateUserDto) {

    try {

      const user = await this.userRepository.findOne({
        where: {
          token
        }
      })

      if (!user) {
        throw new UnauthorizedException('Invalid token')
      }

      if (user.isActive !== true) {
        throw new ForbiddenException('Inactive User')
      }

      user.password = await hashPassword(updateUserDto.password)
      user.token = 'null'
      await this.userRepository.save(user)

      return {
        message: 'Reset password successfully'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {

    try {

      const user = this.userRepository.findOneBy({ id })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      return user

    } catch (error) {
      logger.log(colors.bgRed.black(`${error.message} - user: ${id}`))
      throw new BadRequestException(error.message)
    }
  }

  async updateCurrentUserPassword(updateCurrentPassDto: UpdateCurrentPassDto, id: string) {

    const { current_password, new_password } = updateCurrentPassDto

    try {

      const user = await this.userRepository.findOneBy({ id })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      const password = await comparePassword(current_password, user.password)

      if (!password) {
        throw new UnauthorizedException('Invalid Current Password')
      }

      user.password = await hashPassword(new_password)
      await this.userRepository.save(user)

      return {
        message: 'Password updated successfully'
      }


    } catch (error) {
      logger.log(colors.bgRed.black(`${error.message} - user: ${id}`))
      throw new BadRequestException(error.message)
    }
  }

  async checkPassword(checkPassDto: CheckPassDto, id: string) {

    const { password } = checkPassDto

    try {

      const user = await this.userRepository.findOneBy({ id })

      if (!user) {
        throw new NotFoundException('User not found')
      }

      const validPassword = await comparePassword(password, user.password)

      if (!validPassword) {
        throw new UnauthorizedException('Invalid Password')
      }

      return {
        message: 'Password is correct'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(`${error.message} - user: ${id}`))
      throw new BadRequestException(error.message)
    }
  }

  async update(updateUserDto: UpdateUserDto, id: string) {

    try {
      const user = await this.userRepository.findOneBy({ id })

      if (!user) {
        throw new NotFoundException('User nor found')
      }

      // Validar email si viene en el DTO
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const emailExists = await this.userRepository.findOneBy({
          email: updateUserDto.email,
        });

        if (emailExists) {
          throw new ConflictException('Email already in use');
        }
      }

      // Actualizar usuario
      await this.userRepository.update(id, updateUserDto);

      return { message: 'Profile updated successfully' };

    } catch (error) {
      logger.log(colors.bgRed.black(`${error.message} - user: ${id}`))
      throw new BadRequestException(error.message)
    }

  }
  
  async checkAuthStatus( id: string) {

    try {

      const user = await this.userRepository.findOneBy({id})

      return{
        ...user,
        token: this.generateJwt({id: user!.id}),
        message: 'Token OK'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(`${error.message} - user: ${id}`))
      throw new BadRequestException(error.message)
    }

  }


  //? -  Generador de JWT Token. ---------------

  private generateJwt(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token
  }
  //? ------------------------------------------
}
