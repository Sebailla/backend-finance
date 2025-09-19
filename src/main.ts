import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import colors from 'colors'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap')

  app.enableCors()

  app.setGlobalPrefix('api/v1')

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true,
    }
  ))
  
  const port = process.env.PORT
  await app.listen(port ?? 3000)

  logger.log(colors.bgGreen.black(`App running on port: ${colors.bgYellow.bold(port!)}`))
}
bootstrap();
