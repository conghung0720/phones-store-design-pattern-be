import {
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class AttributeDto {
  // @Is()
  id?: Number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  class: string;

  @IsNotEmpty()
  @IsPositive()
  @IsInt()
  quantity: number;

  // @IsNotEmpty()
  // @IsString()
  // devide_storage?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  price: number;

  // @IsString()
  image: Buffer;
}
