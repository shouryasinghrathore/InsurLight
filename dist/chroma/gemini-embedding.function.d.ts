import type { EmbeddingFunction } from 'chromadb';
export declare class GeminiEmbeddingFunction implements EmbeddingFunction {
    private gemini;
    private modelName;
    constructor(apiKey: string, modelName?: string);
    generate(texts: string[]): Promise<number[][]>;
}
