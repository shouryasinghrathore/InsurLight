import { DocumentsService } from './documents.service';
export declare class DocumentsController {
    private readonly docsService;
    constructor(docsService: DocumentsService);
    uploadFile(file: Express.Multer.File): Promise<{
        message: string;
        chunks: number;
    }>;
}
