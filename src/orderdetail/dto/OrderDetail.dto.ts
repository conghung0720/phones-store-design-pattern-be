import {
    IsEmail,
    IsMongoId,
    IsNotEmpty,
    IsPhoneNumber,
    IsPositive,
    IsString,
  } from 'class-validator';
  import { Types } from 'mongoose';
  
  export class OrderDetailDto {
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;
  
    @IsNotEmpty()
    products: any[];
  
    @IsPositive()
    @IsNotEmpty()
    total_price: number;
  
    @IsString()
    @IsNotEmpty()
    full_name: string;
  
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @IsString()
    @IsNotEmpty()
    address: string;
  
    @IsString()
    @IsNotEmpty()
    phone_number: string;

    price_sale: number;

    percent_sale: number;
  }
  