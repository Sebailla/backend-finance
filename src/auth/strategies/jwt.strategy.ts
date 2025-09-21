import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/auth.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "src";
import { JwtService } from "@nestjs/jwt";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get<string>('JWT_SECRET') || 'default_secret', // Valor predeterminado
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //envia en token en el bearer del header
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;

        // Buscamos al usuario por email
        const user = await this.userRepository.findOne({
            where: { id },
        });

        // Validamos si el usuario existe
        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }

        if (user.confirmed !== true){
            throw new UnauthorizedException('Account is not confirmed');
        }

        // Validamos si el usuario está activo
        if (user.isActive !== true) {
            throw new UnauthorizedException('User is not active');
        }

        return user; // Retornamos el usuario validado
    }
}


