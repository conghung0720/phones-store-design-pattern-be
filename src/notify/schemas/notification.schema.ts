import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema()
export class Notification {
   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
   user_id: MongooseSchema.Types.ObjectId;

   @Prop({ type: String, default: "" })
   title: string;

   @Prop({ type: String, default: "" })
   content: string;

   @Prop({ type: String, default: "" })
   image: string

   @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Product' })
   product_id: MongooseSchema.Types.ObjectId;

   @Prop({ enum: ['unread', 'read'], default: 'unread' })
   status: string;

   @Prop({ type: Boolean, default: false})
   is_send: boolean

   @Prop({ type: Boolean, default: false })
   is_read_all: boolean

   @Prop({ enum: ['quantity_product', 'price']})
   type_notification: string;

   @Prop({ default: Date.now })
   created_at: Date;

   @Prop({ default: Date.now })
   updated_at: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
