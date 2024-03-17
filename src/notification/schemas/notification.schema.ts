import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
   user_id: MongooseSchema.Types.ObjectId;

   @Prop({ required: true })
   title: string;

   @Prop({ required: true })
   content: string;

   @Prop({ enum: ['unread', 'read'], default: 'unread' })
   status: string;

   @Prop()
   read_at: Date;

   @Prop({ required: true })
   type: string;

   @Prop({ type: MongooseSchema.Types.ObjectId })
   source_id: MongooseSchema.Types.ObjectId;

   @Prop({ default: Date.now })
   created_at: Date;

   @Prop({ default: Date.now })
   updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
