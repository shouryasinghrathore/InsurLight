import { Injectable } from '@nestjs/common';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { ChromaService } from '../chroma/chroma.service';
import { GeminiEmbeddingFunction } from '../chroma/gemini-embedding.function';

@Injectable()
export class DocumentsService {
    private embeddingFn: GeminiEmbeddingFunction;

    constructor(private readonly chromaService: ChromaService) {
        this.embeddingFn = new GeminiEmbeddingFunction(process.env.GEMINI_API_KEY);
    }

    async embedText(text: string): Promise<number[]> {
        const embeddings = await this.embeddingFn.generate([text]);
        return embeddings[0];
    }

    async uploadAndIndex(filePath: string, collectionName: string) {
        // 1. Load PDF
        const loader = new PDFLoader(filePath);
        const docs = await loader.load();

        // 2. Split text into chunks
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 200,    // smaller chunks (~200 chars)
            chunkOverlap: 20,  // less overlap
          });
        const splitDocs = await splitter.splitDocuments(docs);

        // 3. Create collection in Chroma Cloud
        const client = this.chromaService.getClient();
        const collection = await client.getOrCreateCollection({
            name: collectionName,
            embeddingFunction: this.embeddingFn
        });

        // 4. Store embeddings
        for (let i = 0; i < splitDocs.length; i++) {
            const embedding = await this.embedText(splitDocs[i].pageContent);
            await collection.add({
                ids: [String(i)],
                documents: [splitDocs[i].pageContent],
                embeddings: [embedding],
            });
        }

        return { message: 'Document indexed successfully', chunks: splitDocs.length };
    }
}
