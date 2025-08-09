import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuestionsController } from './questions/questions.controller';
import { DocumentsController } from './documents/documents.controller';
import { DocumentsService } from './documents/documents.service';
import { QuestionsService } from './questions/questions.service';
import { ChromaService } from './chroma/chroma.service';

@Module({
  imports: [],
  controllers: [AppController,DocumentsController,QuestionsController],
  providers: [AppService,DocumentsService,QuestionsService,ChromaService],
})
export class AppModule {}
