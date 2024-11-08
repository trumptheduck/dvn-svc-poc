import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { GrpcServerExceptionFilter } from "nestjs-grpc-exceptions";
import { APP_FILTER } from '@nestjs/core';
import { ApisModule } from './apis/apis.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECT_URI),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_PRIVATE_KEY,
      signOptions: { expiresIn: '1h' },
    }),
    ApisModule,
  ],
  controllers: [AppController],
  providers: [
  {
    provide: APP_FILTER,
    useClass: GrpcServerExceptionFilter,
  },
    AppService,
  ],
})
export class AppModule {}
