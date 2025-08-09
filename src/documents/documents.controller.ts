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
    const filePath = `./uploads/${file.originalname}`;
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync('./uploads')) {
      fs.mkdirSync('./uploads');
    }

    try {
      // Write file temporarily
      fs.writeFileSync(filePath, file.buffer);
      
      // Process and index the file
      const result = await this.docsService.uploadAndIndex(filePath, 'star_docs');
      
      // Clean up: remove the temporary file
      fs.unlinkSync(filePath);
      
      return result;
    } catch (error) {
      // Clean up in case of error too
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }
}