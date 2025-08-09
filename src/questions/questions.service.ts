import { Injectable } from '@nestjs/common';
import { ChromaService } from '../chroma/chroma.service';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiEmbeddingFunction } from '../chroma/gemini-embedding.function';

@Injectable()
export class QuestionsService {
    private gemini: GoogleGenerativeAI;
    private embeddingFn: GeminiEmbeddingFunction;

    constructor(private readonly chromaService: ChromaService) {
        this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.embeddingFn = new GeminiEmbeddingFunction(process.env.GEMINI_API_KEY);
    }

    async askQuestion(question: string, collectionName: string) {
        // Embed the question via Gemini
        const queryEmbeddings = await this.embeddingFn.generate([question]);

        // Retrieve from Chroma Cloud using our custom embedding function
        const client = this.chromaService.getClient();
        const collection = await client.getCollection({
            name: collectionName,
            embeddingFunction: this.embeddingFn,  // matched signature
        });

        const results = await collection.query({
            queryEmbeddings,
            nResults: 3,
        });

        const context = results.documents.flat().join('\n');

        // Generate a simple, patient-friendly answer with Gemini
        const model = this.gemini.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
        const prompt = `Base your answer ONLY on the provided context".
Context:
${context}

Question: ${question}
Answer in simple, patient-friendly terms:`;

        const result = await model.generateContent(prompt);
        return result.response.text();
    }
}
