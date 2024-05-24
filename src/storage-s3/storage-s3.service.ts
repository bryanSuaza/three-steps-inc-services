import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageS3Service {
  private readonly s3Client = new S3Client({
    region: this.configService.get('AWS_S3_REGION'),
    /* credentials: {
      accessKeyId: this.configService.get('ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('SECRET_ACCESS_KEY'),
    }, */
  });

  constructor(private readonly configService: ConfigService) {}

  async uploadFileS3(
    path: string,
    filename: string,
    extension: string,
    mimetype: string,
    file: Buffer,
  ) {
    console.log(this.configService.get('AWS_S3_BUCKET'));
    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: `${path}/${filename}.${extension}`,
          Body: file,
          ContentType: mimetype,
        }),
      );

      const bucketName = this.configService.get('AWS_S3_BUCKET');
      const region = this.configService.get('AWS_S3_REGION');
      const objectKey = `${path}/${filename}.${extension}`;
      const s3Url = `https://${bucketName}.s3.${region}.amazonaws.com/${objectKey}`;

      return s3Url;
    } catch (error) {
      console.log({ error });
      throw new InternalServerErrorException(
        'Ocurrio una inconsistencia al cargar la imagen',
      );
    }
  }

  async removeFileS3(url: string) {
    try {
      const key = url.split('/').slice(3).join('/');

      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.configService.get('AWS_S3_BUCKET'),
          Key: key,
        }),
      );

      return true;
    } catch (error) {
      throw new InternalServerErrorException(
        'Ocurrio una inconsistencia al cargar la imagen',
      );
    }
  }
}
