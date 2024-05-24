import { Test, TestingModule } from '@nestjs/testing';
import { StorageS3Service } from './storage-s3.service';

describe('StorageS3Service', () => {
  let service: StorageS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageS3Service],
    }).compile();

    service = module.get<StorageS3Service>(StorageS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
