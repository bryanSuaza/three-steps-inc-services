import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Customer extends Document {
  @Prop()
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  mobilephone: string;

  @Prop({
    unique: true,
    index: true,
  })
  email: string;

  @Prop()
  description: string;

  @Prop()
  internal_description: string;

  @Prop()
  state: string;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
