import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'Account',
  versionKey: false,
  timestamps: true
})
export class Account extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop({ required: true })
  balance: number;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
