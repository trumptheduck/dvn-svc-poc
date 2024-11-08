import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const microservice = app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.0:5001',
        package: 'dvn.service.auth',
        protoPath: join(__dirname, '../../../protos/auth.proto'),
      },
  });
  
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
