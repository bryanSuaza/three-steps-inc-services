import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Blog extends Document {
  @Prop({ index: true })
  title: string;

  @Prop({ index: true })
  description: string;

  @Prop({ index: true })
  content: string;

  @Prop({ index: true })
  author: string;

  @Prop({ index: true })
  status: string[];

  @Prop({
    unique: true,
    index: true
  })
  slug: string;

  @Prop({ index: true })
  image: string;

  @Prop()
  createAt: Date;

  @Prop()
  updatedAt: Date;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);