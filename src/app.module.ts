import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomersModule } from './customers/customers.module';
import { StorageS3Module } from './storage-s3/storage-s3.module';
import { BlogModule } from './blog/blog.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    MongooseModule.forRoot(process.env.MONGODB),
    AuthModule,
    UsersModule,
    CustomersModule,
    StorageS3Module,
    BlogModule,
    BannersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
