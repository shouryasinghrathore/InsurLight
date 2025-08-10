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
            chunkSize: 230,
            chunkOverlap: 25,
        });
        const splitDocs = await splitter.splitDocuments(docs);

        // 3. Create collection in Chroma Cloud
        const client = this.chromaService.getClient();
        const collection = await client.getOrCreateCollection({
            name: collectionName,
            embeddingFunction: this.embeddingFn,
        });

        // 4. Prepare batch data
        const baseId = Date.now().toString();
        const docsText = splitDocs.map(d => d.pageContent);
        const embeddings = await Promise.all(docsText.map(text => this.embedText(text)));
        const ids = docsText.map((_, i) => `${baseId}-${i}`);
        const metadatas = splitDocs.map((_, i) => ({
            sourceFile: filePath,
            chunkIndex: i,
            timestamp: new Date().toISOString(),
        }));

        // 5. Add all chunks at once
        await collection.add({
            ids,
            documents: docsText,
            embeddings,
            metadatas,
        });

        return { message: 'Document indexed successfully', chunks: splitDocs.length, collectionName };
    }
}
