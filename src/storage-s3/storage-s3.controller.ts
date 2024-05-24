import {
  Body,
  Controller,
  FileTypeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageS3Service } from './storage-s3.service';

@Controller('storage-s3')
export class StorageS3Controller {
  constructor(private readonly storageS3Service: StorageS3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/png' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() data: any,
  ) {
    const fileName = file.originalname.split(' ').join('_');
    const path = data.path;
    const mimetype = file.mimetype;
    const extension = file.originalname.split('.').pop();
    const url = await this.storageS3Service.uploadFileS3(
      path,
      fileName,
      extension,
      mimetype,
      file.buffer,
    );
    return url;
  }
}
