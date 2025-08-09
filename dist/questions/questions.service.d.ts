import { ChromaService } from '../chroma/chroma.service';
export declare class QuestionsService {
    private readonly chromaService;
    private gemini;
    private embeddingFn;
    constructor(chromaService: ChromaService);
    askQuestion(question: string, collectionName: string): Promise<string>;
}
