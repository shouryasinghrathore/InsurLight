import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';
import { DocumentsService } from './documents.service';
import { Express } from 'express'; 

@Controller('documents')
export class DocumentsController {
  constructor(private readonly docsService: DocumentsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadsDir = './uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    const filePath = `${uploadsDir}/${file.originalname}`;

    try {
      // Save uploaded file temporarily
      fs.writeFileSync(filePath, file.buffer);

      // Generate unique collection name per upload:
      const timestamp = Date.now();
      const safeFileName = file.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const collectionName = `doc_${safeFileName}_${timestamp}`;

      // Upload and index document in a new collection
      const result = await this.docsService.uploadAndIndex(filePath, collectionName);

      // Remove the temp file after processing
      fs.unlinkSync(filePath);

      return result;
    } catch (error) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }
}
