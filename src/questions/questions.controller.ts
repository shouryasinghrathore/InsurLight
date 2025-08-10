import { Controller, Post, Body } from '@nestjs/common';
import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly qs: QuestionsService) {}

  @Post('ask')
  async ask(@Body('question') question: string, @Body('collectionName') collectionName: string) {
    return await this.qs.askQuestion(question, collectionName);
  }
}
