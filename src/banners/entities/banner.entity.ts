import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Banner extends Document {
  @Prop({ index: true })
  alt: string;

  @Prop({ index: true })
  file: string;
}

export const BannerSchema = SchemaFactory.createForClass( Banner );

