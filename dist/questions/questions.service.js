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
exports.QuestionsService = void 0;
const common_1 = require("@nestjs/common");
const chroma_service_1 = require("../chroma/chroma.service");
const generative_ai_1 = require("@google/generative-ai");
const gemini_embedding_function_1 = require("../chroma/gemini-embedding.function");
let QuestionsService = class QuestionsService {
    constructor(chromaService) {
        this.chromaService = chromaService;
        this.gemini = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.embeddingFn = new gemini_embedding_function_1.GeminiEmbeddingFunction(process.env.GEMINI_API_KEY);
    }
    async askQuestion(question, collectionName) {
        const queryEmbeddings = await this.embeddingFn.generate([question]);
        const client = this.chromaService.getClient();
        const collection = await client.getCollection({
            name: collectionName,
            embeddingFunction: this.embeddingFn,
        });
        const results = await collection.query({
            queryEmbeddings,
            nResults: 3,
        });
        const context = results.documents.flat().join('\n');
        const model = this.gemini.getGenerativeModel({ model: 'models/gemini-2.0-flash' });
        const prompt = `Base your answer ONLY on the provided context".
Context:
${context}

Question: ${question}
Answer in simple, patient-friendly terms:`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    }
};
exports.QuestionsService = QuestionsService;
exports.QuestionsService = QuestionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [chroma_service_1.ChromaService])
], QuestionsService);
//# sourceMappingURL=questions.service.js.map