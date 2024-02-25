import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose, SchemaType, Types } from 'mongoose';

@Schema()
export class Cart {
  @Prop({
    required: true,
  })
  user: Types.ObjectId;

  @Prop({
    default: [],
  })
  items_cart: any[];

  @Prop({
    default: 0,
  })
  count_item_cart: number;

  @Prop({
    default: 0,
    required: true,
  })
  total_price_cart: number;

  @Prop({
    required: false,
  })
  percent_sale: number

  @Prop({
    required: false
  })
  price_sale: number
}

export const CartSchema = SchemaFactory.createForClass(Cart);
