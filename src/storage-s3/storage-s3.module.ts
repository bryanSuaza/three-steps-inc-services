import { Module } from '@nestjs/common';
import { StorageS3Service } from './storage-s3.service';
import { StorageS3Controller } from './storage-s3.controller';

@Module({
  controllers: [StorageS3Controller],
  providers: [StorageS3Service],
})
export class StorageS3Module {}
