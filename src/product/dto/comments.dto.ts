import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";

export class CommentDto{
    @IsNotEmpty()
    userId: string

    @IsNotEmpty()
    productId: string

    @IsNotEmpty()
    @IsString()
    comment: string

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number
}