import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({
  collection: 'TransactionDetails',
  versionKey: false,
  timestamps: true
})
export class TransactionDetails extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true })
  accID: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  transMoney: number;

  @Prop({ required: true })
  transType: string;

  @Prop({ required: true })
  dateOfTrans: Date;
}

export const TransactionDetailsSchema = SchemaFactory.createForClass(TransactionDetails);
