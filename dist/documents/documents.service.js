"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const pdf_1 = require("@langchain/community/document_loaders/fs/pdf");
const text_splitter_1 = require("langchain/text_splitter");
const chroma_service_1 = require("../chroma/chroma.service");
const gemini_embedding_function_1 = require("../chroma/gemini-embedding.function");
let DocumentsService = class DocumentsService {
    constructor(chromaService) {
        this.chromaService = chromaService;
        this.embeddingFn = new gemini_embedding_function_1.GeminiEmbeddingFunction(process.env.GEMINI_API_KEY);
    }
    async embedText(text) {
        const embeddings = await this.embeddingFn.generate([text]);
        return embeddings[0];
    }
    async uploadAndIndex(filePath, collectionName) {
        const loader = new pdf_1.PDFLoader(filePath);
        const docs = await loader.load();
        const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
        });
        const splitDocs = await splitter.splitDocuments(docs);
        const client = this.chromaService.getClient();
        const collection = await client.getOrCreateCollection({
            name: collectionName,
            embeddingFunction: this.embeddingFn
        });
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
};
exports.DocumentsService = DocumentsService;
exports.DocumentsService = DocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chroma_service_1.ChromaService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map