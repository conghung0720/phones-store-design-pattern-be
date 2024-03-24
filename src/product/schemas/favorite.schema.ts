import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class FavoriteProduct {
  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  users_favorited: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  current_price: number;

  @Prop({ required: true })
  old_price: number;

}

export type FavoriteProductDocument = FavoriteProduct & Document;

export const FavoriteProductSchema =
  SchemaFactory.createForClass(FavoriteProduct);
