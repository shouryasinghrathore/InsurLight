import { CloudClient } from 'chromadb';
export declare class ChromaService {
    client: CloudClient;
    constructor();
    getClient(): CloudClient;
}
