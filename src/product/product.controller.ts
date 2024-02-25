import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ObjectId } from 'mongodb';

import mongoose, { Mongoose, Types } from 'mongoose';
import { CommentDto } from './dto/comments.dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('list')
  async listProduct() {
    return await this.productService.listPros();
  }

  @Post()
  async addProduct(@Body() product: ProductDto) {
    return this.productService.create(product);
  }

  @Get(':id')
  async getProductById(@Param('id') id: Types.ObjectId) {
    return this.productService.getProductById({ idProduct: id });
  }

  @Post('findSubProduct')
  async getSubProductById(@Body() product) {
    return this.productService.getSubProductById({
      idProduct: product.productId,
      idAttr: product.attrId,
    });
  }
  @Post('delete')
  async deleteProduct(@Body() product){
    return await this.productService.deleteProductById({productId: product._id})
  }

  @Post('updateProduct')
  async updateProduct(@Body() product: ProductDto) {
    return this.productService.editProductById(product);
  }

  @Post('comment')
  async commentProduct(@Body() comment: CommentDto){
    return await this.productService.commentProduct(comment)
  }

}
