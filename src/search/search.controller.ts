import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Product } from 'src/checkout/schema/checkout.schema';

@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('search')
    async searchProducts(@Query('keyword') keyword: string): Promise<Product[]> {
      return this.searchService.searchProducts(keyword);
    }
}
