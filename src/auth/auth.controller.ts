import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, RequestMethod, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { LoginDto } from './dto/login.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCurrentPassDto } from './dto/update-current-pass.dto';
import { CheckPassDto } from './dto/check-pass.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('confirm-account')
  confirmAccount(@Body() updateUserDto: UpdateUserDto) {
    return this.authService.confirmAccount(updateUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() updatePassDto: UpdatePassDto) {
    return this.authService.forgotPassword(updatePassDto);
  }

  @Post('validate-token')
  validateToken(@Body() UpdateUserDto: UpdateUserDto) {
    return this.authService.validateToken(UpdateUserDto);
  }

  @Post('reset-password/:token')
  resetPasswordWithToken(
    @Param('token') token: string,
    @Body() UpdateUserDto: UpdateUserDto
  ) {
    return this.authService.resetPasswordWithToken(token, UpdateUserDto);
  }

  @Get('user/:id')
  @UseGuards(AuthGuard())
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Post('update-password')
  @UseGuards(AuthGuard('jwt'))
  updateCurrentUserPassword(
    @Req() req,
    @Body() updateCurrentPassDto: UpdateCurrentPassDto
  ) {
    const id = req.user.id
    return this.authService.updateCurrentUserPassword( updateCurrentPassDto, id);
  }

  @Post('check-password')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  checkPassword(
    @Req() req, 
    @Body() checkPassDto: CheckPassDto
  ){
    const id = req.user.id
    return this.authService.checkPassword(checkPassDto, id)
  }

  @Put('user')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Req() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const id = req.user.id
    return this.authService.update(updateUserDto, id);
  }
}
