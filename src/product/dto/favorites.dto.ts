import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FavoriteProductDto {
    @IsArray()
    @IsNotEmpty()
    usersFavorited: [];

    @IsString()
    @IsNotEmpty()
    product: string;

    @IsNumber()
    @IsNotEmpty()
    currentPrice: number;

    @IsNumber()
    @IsNotEmpty()
    oldPrice: number;

}

