import type { EmbeddingFunction } from 'chromadb';
import { GoogleGenerativeAI } from '@google/generative-ai';


export class GeminiEmbeddingFunction implements EmbeddingFunction {
  private gemini: GoogleGenerativeAI;
  private modelName: string;

  constructor(apiKey: string, modelName = 'models/embedding-001') {
    if (!apiKey) throw new Error('GEMINI_API_KEY is required for GeminiEmbeddingFunction');
    this.gemini = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
  }

  /**
   * Generates embeddings for an array of texts using Gemini.
   * Returns a 2D array: number[][] (one embedding array per input text).
   */
  async generate(texts: string[]): Promise<number[][]> {
    if (!Array.isArray(texts)) throw new TypeError('texts must be an array of strings');

    const model = this.gemini.getGenerativeModel({ model: this.modelName });

    const embeddings = await Promise.all(
      texts.map(async (t) => {
        const resp = await model.embedContent(t);
        // resp.embedding.values — shape should be number[]
        return resp.embedding.values;
      })
    );

    return embeddings;
  }
}
