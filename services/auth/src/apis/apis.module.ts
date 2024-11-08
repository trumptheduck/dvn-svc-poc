import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user/schemas/user.schema';
import { UserService } from './user/user.service';
import { PermissionService } from './permission/permission.service';
import { AuthService } from './auth/auth.service';
import { UserController } from './user/user.controller';
import { AuthController } from './auth/auth.controller';
import { PermissionController } from './permission/permission.controller';
import { Permission, PermissionSchema } from './permission/schemas/permission.schema';
import { APP_FILTER } from '@nestjs/core';
import { GrpcServerExceptionFilter } from 'nestjs-grpc-exceptions';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: User.name, schema: UserSchema},
            {name: Permission.name, schema: PermissionSchema},
        ]),
        CacheModule.register()
    ],
    controllers: [
        UserController,
        AuthController,
        PermissionController
    ],
    providers: [
        UserService,
        AuthService,
        PermissionService
    ]
})
export class ApisModule {}
