import {
  IsArray,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Types } from 'mongoose';

export class CartDto {
  @IsNotEmpty()
  @IsMongoId()
  user: Types.ObjectId;

  @IsArray()
  items_cart: [];

  @IsNumber()
  @IsPositive()
  count_item_cart: number;

  @IsNumber()
  @IsPositive()
  total_price_cart: number;
}

export class ItemToCartDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: Types.ObjectId;

  //Id Item in attributes
  id?: Number;

  @IsNotEmpty()
  userId: Types.ObjectId | string;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsString()
  devide_storage: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @IsString()
  image: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class DeleteItemDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  cartId: Types.ObjectId;

  @IsNotEmpty()
  @IsMongoId()
  productId: Types.ObjectId;

  id: Number;
}
