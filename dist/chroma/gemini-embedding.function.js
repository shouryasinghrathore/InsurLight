"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiEmbeddingFunction = void 0;
const generative_ai_1 = require("@google/generative-ai");
class GeminiEmbeddingFunction {
    constructor(apiKey, modelName = 'models/embedding-001') {
        if (!apiKey)
            throw new Error('GEMINI_API_KEY is required for GeminiEmbeddingFunction');
        this.gemini = new generative_ai_1.GoogleGenerativeAI(apiKey);
        this.modelName = modelName;
    }
    async generate(texts) {
        if (!Array.isArray(texts))
            throw new TypeError('texts must be an array of strings');
        const model = this.gemini.getGenerativeModel({ model: this.modelName });
        const embeddings = await Promise.all(texts.map(async (t) => {
            const resp = await model.embedContent(t);
            return resp.embedding.values;
        }));
        return embeddings;
    }
}
exports.GeminiEmbeddingFunction = GeminiEmbeddingFunction;
//# sourceMappingURL=gemini-embedding.function.js.map