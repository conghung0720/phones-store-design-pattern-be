import { IsNumber, IsString, IsNotEmpty, IsEnum } from "class-validator";
import { TypeSearch } from "../d";

export class SearchDto {
    @IsString()
    @IsNumber()
    @IsNotEmpty()
    keyword: string

    @IsEnum([TypeSearch.DESCRIPTION, TypeSearch.NAME, TypeSearch.PRICE])
    @IsNotEmpty()
    type: string
}