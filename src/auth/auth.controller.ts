import { Controller, Get, Post, Body, Param, Put, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation.pipe';
import { LoginDto } from './dto/login.dto';
import { UpdatePassDto } from './dto/update-pass.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCurrentPassDto } from './dto/update-current-pass.dto';
import { CheckPassDto } from './dto/check-pass.dto';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { Auth } from './decorators/auth.decorator';

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
  @Auth(ValidRoles.admin, ValidRoles.user)
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Post('update-password')
  @Auth(ValidRoles.admin, ValidRoles.user)
  updateCurrentUserPassword(
    @GetUser() user: User,
    @Body() updateCurrentPassDto: UpdateCurrentPassDto
  ) {
    return this.authService.updateCurrentUserPassword(updateCurrentPassDto, user.id);
  }

  @Post('check-password')
  @HttpCode(HttpStatus.OK)
  @Auth(ValidRoles.admin, ValidRoles.user)
  checkPassword(
    @GetUser('id') id: string,
    @Body() checkPassDto: CheckPassDto
  ) {
    return this.authService.checkPassword(checkPassDto, id)
  }

  @Put('user')
  @Auth(ValidRoles.admin, ValidRoles.user)
  update(
    @GetUser() user: User,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.authService.update(updateUserDto, user.id);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser('id') id: string,
  ){
    return this.authService.checkAuthStatus(id)
  }
}
