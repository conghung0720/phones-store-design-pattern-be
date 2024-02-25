import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
    constructor(private brandService: BrandService) {}

    @Post()
    async newBrand(@Body() brand: { name: string }) {
        return await this.brandService.create(brand)
    }

    @Get()
    async findAllBrands() {
        return await this.brandService.findAll();
    }

    @Get(':id')
    async findBrandById(@Param('id') id: string) {
        return await this.brandService.findById(id);
    }

    @Put(':id')
    async updateBrand(@Param('id') id: string, @Body() brand: { name: string }) {
        return await this.brandService.update(id, brand);
    }

    @Delete(':id')
    async deleteBrand(@Param('id') id: string) {
        return await this.brandService.delete(id);
    }




}
