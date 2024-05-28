import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvConfiguration } from 'src/config/env.config';

import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { Blog, BlogSchema } from './entities/blog.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
    ]),
  ],
  controllers: [ BlogController ],
  providers: [ BlogService ]
})
export class BlogModule {}
