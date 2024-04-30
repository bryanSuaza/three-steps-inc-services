import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({
    unique: true,
    index: true,
  })
  username: string;

  @Prop({
    unique: true,
    index: true,
  })
  password: string;

  @Prop({
    unique: true,
    index: true,
  })
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
}

export const UserSchema = SchemaFactory.createForClass(User);
