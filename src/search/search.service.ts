import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from 'src/checkout/schema/checkout.schema';
import { SearchStrategy } from './strategy/search.strategy';
import { NameSearchStrategy } from './strategy/name-search.strategy';
import { TypeSearch } from './d';
import { PriceSearchStrategy } from './strategy/price-search.strategy';
import { DescriptionSearchStrategy } from './strategy/description-search.strategy';

@Injectable()
export class SearchService {
  constructor(
    private nameStrategy: NameSearchStrategy,
    private priceStrategy: PriceSearchStrategy,
    private descriptionStrategy: DescriptionSearchStrategy,
  ) {}

  async searchProducts(keyword: string, type: TypeSearch): Promise<Product[]> {
    const searchProduct = new SearchStrategy(this.nameStrategy);

    switch (type) {
      case TypeSearch.PRICE:
        searchProduct.setStrategy(this.priceStrategy);
      case TypeSearch.NAME:
        searchProduct.setStrategy(this.nameStrategy);
      case TypeSearch.DESCRIPTION:
        searchProduct.setStrategy(this.descriptionStrategy);
      default:
        searchProduct.setStrategy(this.nameStrategy);
    }

    return searchProduct.search(keyword);
    // return search.search(keyword);
  }
}
