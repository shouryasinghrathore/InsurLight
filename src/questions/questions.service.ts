import { Injectable, Logger } from '@nestjs/common';
import { ChromaService } from '../chroma/chroma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiEmbeddingFunction } from '../chroma/gemini-embedding.function';

@Injectable()
export class QuestionsService {
  private readonly logger = new Logger(QuestionsService.name);

  private gemini: GoogleGenerativeAI;
  private embeddingFn: GeminiEmbeddingFunction;

  constructor(private readonly chromaService: ChromaService) {
    this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.embeddingFn = new GeminiEmbeddingFunction(process.env.GEMINI_API_KEY);
  }

  async askQuestion(question: string, collectionName: string) {
    this.logger.log(`Received question: "${question}"`);

    const queryEmbeddings = await this.embeddingFn.generate([question]);

    const client = this.chromaService.getClient();

    const collection = await client.getCollection({
      name: collectionName,
      embeddingFunction: this.embeddingFn,
    });

    const results = await collection.query({
      queryEmbeddings,
      nResults: 2,
    });

    const context = results.documents.flat().join('\n');
    this.logger.debug(`Context retrieved: ${context}`);

    const model = this.gemini.getGenerativeModel({ model: 'models/gemini-2.0-flash' });

    const prompt = `Base your answer ONLY on the provided context".
Context:
${context}

Question: ${question}
Answer in simple, patient-friendly terms:`;

    const result = await model.generateContent(prompt);

    const answer = result.response.text();
    this.logger.log(`Generated answer: ${answer}`);

    return answer;
  }
}
