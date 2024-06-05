import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { EnvConfiguration } from 'src/config/env.config';
import { Banner, BannerSchema } from './entities/banner.entity';
import { BannersController } from './banners.controller';
import { BannersService } from './banners.service';
import { StorageS3Service } from 'src/storage-s3/storage-s3.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
    }),
    MongooseModule.forFeature([
      {
        name: Banner.name,
        schema: BannerSchema,
      },
    ]),
  ],
  controllers: [ BannersController ],
  providers: [ BannersService, StorageS3Service ]
})
export class BannersModule {}
