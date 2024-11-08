import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGetUserFromTokenDTO, AuthLoginDTO, AuthRegisterDTO } from './dtos/auth.dtos';
import { AuthUser, ParamsGetUserFromToken } from 'src/generated/protos/auth';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { GrpcMethod } from '@nestjs/microservices';
import { GrpcNotFoundException } from 'nestjs-grpc-exceptions';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post("register")
    async register(@Body() dto: AuthRegisterDTO) {
        return await this.authService.register(dto);
    }

    @Post("login")
    async login(@Body() dto: AuthLoginDTO) {
        return await this.authService.login(dto);
    }

    @Post("getUserFromToken")
    async getUserFromToken(@Body() dto: AuthGetUserFromTokenDTO) {
        return await this.authService.getUserFromToken(dto.token);
    }

    @GrpcMethod('AuthService', 'getUserFromToken')
    async getUserFromTokenRPC(data: ParamsGetUserFromToken, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<AuthUser> {
        try {
            return await this.authService.getUserFromToken(data.token) as any;
        } catch (err) {
            console.log(err);
            if (err.rpc) {
                throw err.rpc;
            }
            throw new GrpcNotFoundException("User not found");
        }
    }
}