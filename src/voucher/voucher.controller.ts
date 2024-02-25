import { Body, Controller, Get, Post } from '@nestjs/common';
import { VoucherService } from './voucher.service';
import { VoucherDto, VoucherUseDto } from './dto/d';

@Controller('voucher')
export class VoucherController {
    constructor(private voucherService: VoucherService) {}

    @Post('create')
    async newVoucher(@Body() voucher) {
        // console.log(voucher);
        return await this.voucherService.newVoucher(voucher)
    }

    @Post('useVoucher')
    async useVoucher (@Body() voucher: VoucherUseDto) {
        return await this.voucherService.useVoucher(voucher);
    }

    @Get('list')
    async voucherList () {
        return await this.voucherService.voucherList()
    }

    @Post('remove')
    async removeVoucher(@Body() voucher: { voucherId: string} ) {
        return await this.voucherService.removeVoucherById(voucher.voucherId);
    }

    @Post('edit')
    async editVoucher(@Body() voucher){
        return await this.voucherService.editVoucher(voucher);
    }

    @Post('applyVoucher')
    async applyVoucher(@Body() voucher){
        return await this.voucherService.findVoucherByVoucherName(voucher.voucherName);
    }
}
