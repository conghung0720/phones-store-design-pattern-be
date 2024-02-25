import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsPositive } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;

@Schema()
export class Product {
  // @Prop({
  //     required: true,
  //     ref: 'brand'
  //   })
  //   brand: Types.ObjectId;

  @Prop({
    required: true,
    length: 40,
  })
  name: string;

  @Prop({
    required: true,
    default: 0,
    validate: [IsPositive],
  })
  price: number;

  @Prop({
    require: true,
    default: 0,
    validate: [IsPositive],
  })
  quantity_sold: number;
  
 @Prop({
    required:false
  })
  percent_sale: number;

  @Prop({
    required: false
  })
  price_sale: number;

  @Prop({
    require: true,
    default: 'Không có mô tả',
    length: 1000,
  })
  description: string;

  @Prop({ require: true })
  main_image: string;

  @Prop({
    required: true,
  })
  highlights: [];

  @Prop({
    require: true,
  })
  detail: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
