import { ChromaService } from '../chroma/chroma.service';
export declare class DocumentsService {
    private readonly chromaService;
    private embeddingFn;
    constructor(chromaService: ChromaService);
    embedText(text: string): Promise<number[]>;
    uploadAndIndex(filePath: string, collectionName: string): Promise<{
        message: string;
        chunks: number;
    }>;
}
