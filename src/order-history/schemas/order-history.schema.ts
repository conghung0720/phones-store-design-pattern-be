import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsPositive } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;

@Schema()
export class OrderHistory {
  // @Prop({
  //     required: true,
  //     ref: 'brand'
  //   })
  //   brand: Types.ObjectId;

  @Prop({
    required: true,
    ref: 'user',
  })
  userId: Types.ObjectId;

  @Prop({
    require: true,
  })
  products: [];

  @Prop({
    required: true,
    default: 0,
    validate: [IsPositive],
  })
  total_price: number;

  @Prop({ required: true })
  full_name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  address: string;

  @Prop({
    required: true,
  })
  phone_number: number;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  createAt: Date;

  @Prop({
    type: Date,
    default: () => new Date(),
  })
  updateAt: Date;
}

export const OrderHistorySchema = SchemaFactory.createForClass(OrderHistory);
