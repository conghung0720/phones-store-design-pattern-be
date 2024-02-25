import {
  IsArray,
  IsBase64,
  IsEmpty,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { AttributeDto } from './attributes.tdo';
import { Types } from 'mongoose';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsMongoId()
  // @IsNotEmpty()
  // brand: Types.ObjectId
  @IsNumber()
  @IsPositive()
  quantity_sold: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @Type(() => AttributeDto)
  @ValidateNested({ each: true })
  @IsArray()
  attributes: AttributeDto[];

  @IsArray()
  @IsNotEmpty()
  highlights: [];

  @IsNotEmpty()
  // @()
  main_image: Buffer;

  @IsString()
  brand: string;
}

export class ProductToCartDto extends AttributeDto {
  @IsMongoId()
  @IsNotEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;
}
