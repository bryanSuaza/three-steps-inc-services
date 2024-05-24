import { Test, TestingModule } from '@nestjs/testing';
import { StorageS3Controller } from './storage-s3.controller';
import { StorageS3Service } from './storage-s3.service';

describe('StorageS3Controller', () => {
  let controller: StorageS3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageS3Controller],
      providers: [StorageS3Service],
    }).compile();

    controller = module.get<StorageS3Controller>(StorageS3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
