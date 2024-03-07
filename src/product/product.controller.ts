import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ObjectId } from 'mongodb';

import mongoose, { Mongoose, Types } from 'mongoose';
import { CommentDto } from './dto/comments.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) { }

  @Get('list')
  async getAll() {
    return await this.productService.getAll();
  }

  @Post()
  async create(@Body() product: ProductDto) {
    return this.productService.create(product);
  }

  @Get(':id')
  async getById(@Param('id') id: Types.ObjectId) {
    return this.productService.getById({ idProduct: id });
  }

  @Post('findSubProduct')
  async findSubProductById(@Body() product) {
    return this.productService.findSubProductById({
      idProduct: product.productId,
      idAttr: product.attrId,
    });
  }
  @Post('delete')
  async delete(@Body() product) {
    return await this.productService.deleteProductById({ productId: product._id })
  }

  @Post('updateProduct')
  async update(@Body() product: ProductDto) {
    return this.productService.editProductById(product);
  }

  @Post('comment')
  async comment(@Body() comment: CommentDto) {
    return await this.productService.commentProduct(comment)
  }

}
