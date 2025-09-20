import { Controller, Get, Post, Body, Param, Delete, Put} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { IdValidationPipe } from 'src/common/pipes/id-validation/id-validation.pipe';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('confirm-account')
  confirmAccount(@Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.confirmAccount(updateAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get('user/:id')
  findOne(@Param('id', IdValidationPipe) id: string) {
    return this.authService.findOne(id);
  }

  @Put('user/:id')
  update(
    @Param('id', IdValidationPipe) id: string,
    @Body() updateAuthDto: UpdateAuthDto
  ) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete('user/:id')
  remove(@Param('id', IdValidationPipe) id: string) {
    return this.authService.remove(id);
  }
}
