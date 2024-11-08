import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { EForbidden, EUnauth } from '../models/exception.models';
import { arrayUnique, isArrayEmpty } from '../utils/global.utils';
import { AuthService } from 'src/apis/auth/auth.service';
import { User } from '../../apis/user/schemas/user.schema';

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private reflector: Reflector, private auth$: AuthService) {}
    async canActivate(context: ExecutionContext,): Promise<boolean> {
        const permissionHander = this.reflector.get<string[]>('permissions', context.getHandler())??[];
        const classPermissionHandler = this.reflector.get<string[]>('permissions', context.getClass())??[];
        const roles = arrayUnique([...classPermissionHandler, ...permissionHander]);
        if (isArrayEmpty(roles)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const _user = await this.getUserData(request);
        response.locals.user = _user;
        
        return this.validatePermissions(_user, roles);
    }

    validatePermissions(user: User, permissions: string[]): boolean {
        let allowed = false;
        permissions.forEach(permission => {
            let result = this.validatePermission(user, permission);
            if (result) allowed = true;
        })
        return allowed;
    }

    validatePermission(user: User, permission: string): boolean {
        if (permission.length < 0) return false;
        user.permissions.find(p => p = permission);
        const levels = permission.split(".");
        const lastSegment = levels.pop();
        if (lastSegment == "*") {
            levels.pop();
        }
        const _permission = [...levels, "*"].join(".");
        return this.validatePermission(user, _permission);
    }

    async getUserData(request: Request): Promise<User> {
        const _authHeader = request.headers['authorization'];
        if (_authHeader?.startsWith("Bearer ")){
            const _token = _authHeader.substring(7, _authHeader.length);
            return this.auth$.getUserFromToken(_token);
        } else {
            throw new EUnauth();
        }
    }
}