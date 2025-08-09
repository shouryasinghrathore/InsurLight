import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Enable CORS
    app.use(cors({
      origin: '*', 
    }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
