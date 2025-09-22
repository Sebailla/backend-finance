<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# Custom decorators: 

```@GetUser() user:User```

```@GetUser('id') id:string```

Custon decorator para obtener el user de la request:
Sipasamos la data que queremos de la request @GetUser('id'), solo nos devuelve el 'id', sino devuelve el user completo.

```@Auth(ValidRoles.admin, ValidRoles.user)```

Valida el usuario y los roles 

Para que todo lo referente a AuthModule funcione en otros modulos, se debe importar en cada module donde se quiera validar la ruta





Modelo completo, con código y explicación paso a paso, para añadir Google OAuth en tu aplicación.

⸻

🔧 1. Instalar dependencias

npm install passport-google-oauth20 @nestjs/passport passport
npm install -D @types/passport-google-oauth20


⸻

🔧 2. Crear la configuración google-oauth.config.ts

En tu carpeta config:

// src/config/google-oauth.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/auth/google/callback',
}));

En tu .env:

GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback


⸻

🔧 3. Estrategia con Passport

// src/auth/strategies/google.strategy.ts
import { Injectable, Inject } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../../config/google-oauth.config';
import type { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private googleConfig: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: googleConfig.clientID,
      clientSecret: googleConfig.clientSecret,
      callbackURL: googleConfig.callbackURL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails, name, photos } = profile;

    // ⚡ Aquí delegamos en el servicio de auth
    const user = await this.authService.validateGoogleUser({
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
      avatarUrl: photos[0].value,
    });

    done(null, user);
  }
}


⸻

🔧 4. Auth Service (método para Google)

En auth.service.ts añadimos un método para manejar el login con Google:

// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async validateGoogleUser(profile: {
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
  }) {
    let user = await this.userRepository.findOne({ where: { email: profile.email } });

    if (!user) {
      user = this.userRepository.create({
        email: profile.email,
        name: profile.firstName,
        lastName: profile.lastName,
        image: profile.avatarUrl,
        password: '', // ⚠️ no password porque es Google
        confirmed: true,
        isActive: true,
        role: ['user'],
        token: '',
      });
      await this.userRepository.save(user);
    }

    // Retornamos user + token JWT
    const payload = { id: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return { user, token };
  }
}


⸻

🔧 5. Auth Controller

// src/auth/auth.controller.ts
import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  // Paso 1: Redirige a Google
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport redirige a Google automáticamente
  }

  // Paso 2: Callback de Google
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req) {
    return {
      message: 'Google login successful',
      user: req.user, // viene del strategy
    };
  }
}


⸻

🔧 6. Registrar la estrategia y config en AuthModule

// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigModule } from '@nestjs/config';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({}), // ⚡ ya lo configuraste en tu JWT normal
    ConfigModule.forFeature(googleOauthConfig),
  ],
  providers: [AuthService, GoogleStrategy],
  controllers: [AuthController],
})
export class AuthModule {}


⸻

🔧 7. Flujo final
	1.	Usuario va a GET /auth/google → NestJS lo redirige a Google.
	2.	Google pide login y permisos.
	3.	Google redirige a GET /auth/google/callback.
	4.	Estrategia valida datos y AuthService registra/valida el user.
	5.	Devuelve user + JWT para integrarlo con tu sistema existente.

⸻




