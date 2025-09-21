import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from '../entities/auth.entity';


@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    //Declaramos roles validos
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler())

    //Dejamos pasar
    if (!validRoles) return true
    if (validRoles.length === 0) return true

    //Obtenemos el User del header
    const user = context.switchToHttp().getRequest().user as User;

    if (!user)
      throw new BadRequestException('User not found')

    //Evaluamos que el rol del user este entre los validRoles
    for (const role of user.role) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(`User ${user.name} ${user.lastName}, need a valid role: [${validRoles}]`);
  }
}
