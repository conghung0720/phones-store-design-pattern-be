import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Product } from 'src/checkout/schema/checkout.schema';
import { TypeSearch } from './d';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchProducts(
    @Query('keyword') keyword: string,
    @Query('type') type: TypeSearch,
  ): Promise<Product[]> {
    return this.searchService.searchProducts(keyword, type);
  }
}
