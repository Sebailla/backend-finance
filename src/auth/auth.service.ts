import { BadRequestException, ConflictException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthEmail, comparePassword, generateJWT, generateToken, hashPassword } from 'src';
import { Auth } from './entities/auth.entity';
import colors from 'colors'
import { LoginDto } from './dto/login.dto';

//Nest console loggs
const logger = new Logger('Bootstrap')

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(Auth) private readonly authRepository: Repository<Auth>,
  ) { }

  async register(createAuthDto: CreateAuthDto) {

    try {

      const existeUser = await this.authRepository.findOne({
        where: {
          email: createAuthDto.email
        }
      })

      if (existeUser) {
        throw new ConflictException('User already exists')
      }

      const newUser = this.authRepository.create(createAuthDto)
      newUser.password = await hashPassword(newUser.password)
      newUser.token = generateToken()

      const user = await this.authRepository.save(newUser)

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
      logger.log(colors.bgRed.black(error))
      throw new BadRequestException('Something went wrong')
    }

  }

  async confirmAccount(updateAuthDto: UpdateAuthDto) {

    try {
      const token = updateAuthDto.token
      const user = await this.authRepository.findOne({
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
      await this.authRepository.save(user)

      return {
        message: 'Account confirmed successfully, redirect to Login'
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException('Something went wrong')
    }



    return 'This action confirm a new account';
  }

  async login(loginDto: LoginDto) {
    
    try {

      const user = await this.authRepository.findOne({
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

      const token = generateJWT(user.id)

      return {
        message: 'Login successfully', token: token
      }

    } catch (error) {
      logger.log(colors.bgRed.black(error.message))
      throw new BadRequestException('Something went wrong')
    }
  
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: string) {
    return `This action returns a #${id} auth`;
  }

  update(id: string, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
