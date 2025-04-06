import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    //habilitamos ValidationPipe para que pueda ser útil nuestro DTO
    //whiteList: true, para que solo se acepten los datos que están en el DTO
    app.useGlobalPipes(
        new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
