import { Global, Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Product, ProductSchema } from 'src/product/schemas/product.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceSearchStrategy } from './strategy/price-search.strategy';
import { NameSearchStrategy } from './strategy/name-search.strategy';
import { SearchStrategy } from './strategy/search.strategy';
import { DescriptionSearchStrategy } from './strategy/description-search.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [SearchController],
  providers: [SearchService, PriceSearchStrategy, NameSearchStrategy, SearchStrategy, DescriptionSearchStrategy]

})
export class SearchModule {}
