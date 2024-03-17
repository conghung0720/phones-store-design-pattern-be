import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/checkout/schema/checkout.schema';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}
  
  async searchProducts(keyword: string): Promise<Product[]> {
    return this.productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      })
      .exec();
  }
}
