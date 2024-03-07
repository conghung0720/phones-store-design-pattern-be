import { Body, Controller, Get, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherDto, VoucherUseDto } from './dto/d';

@Controller('voucher')
export class VoucherController {
    constructor(private voucherService: VoucherService) { }

    @Post('create')
    async create(@Body() voucher) {
        // console.log(voucher);
        return await this.voucherService.create(voucher)
    }

    @Post('useVoucher')
    async useVoucher(@Body() voucher: VoucherUseDto) {
        return await this.voucherService.useVoucher(voucher);
    }

    @Get('list')
    async getAll() {
        return await this.voucherService.getAll()
    }

    @Post('remove')
    async remove(@Body() voucher: { voucherId: string }) {
        return await this.voucherService.remove(voucher.voucherId);
    }

    @Post('edit')
    async edit(@Body() voucher) {
        return await this.voucherService.edit(voucher);
    }

    @Post('applyVoucher')
    async applyVoucher(@Body() voucher) {
        return await this.voucherService.findVoucherByVoucherName(voucher.voucherName);
    }
}
