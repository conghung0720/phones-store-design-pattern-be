import { IsArray, IsInt, IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"


export class VoucherUseDto {
    @IsNotEmpty()
    @IsString()
    codeVoucher: string

    @IsNotEmpty()
    @IsString()
    userId: string;
}

export class VoucherDto {

    @IsNotEmpty()
    @IsNumber()
    priceSale: number

    @IsArray()
    userUsed: []

    @IsString()
    @IsNotEmpty()
    nameVoucher: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsNumber()
    @IsPositive()
    maxPriceSale: number

    @IsInt()
    @IsNotEmpty()
    @IsPositive()
    quantity: number;

    @IsString()
    @IsNotEmpty()
    codeVoucher: string;
}