import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
    constructor(private brandService: BrandService) { }

    @Post()
    async create(@Body() brand: { name: string }) {
        return await this.brandService.create(brand)
    }

    @Get()
    async getAll() {
        return await this.brandService.getAll();
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.brandService.getById(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() brand: { name: string }) {
        return await this.brandService.update(id, brand);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.brandService.delete(id);
    }




}
