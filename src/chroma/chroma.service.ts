import { Injectable } from '@nestjs/common';
import { CloudClient } from 'chromadb';

@Injectable()
export class ChromaService {
  client: CloudClient;

  constructor() {
    this.client = new CloudClient({
      apiKey: process.env.CHROMA_API_KEY,
      tenant: process.env.CHROMA_TENANT_ID,
      database: process.env.CHROMA_DATABASE,
    });
  }

  getClient() {
    return this.client;
  }
}
