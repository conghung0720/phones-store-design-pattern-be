import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherService } from './voucher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Voucher, VoucherSchema } from './schemas/voucher.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Voucher.name, schema: VoucherSchema }]),],
  controllers: [VoucherController],
  providers: [VoucherService]
})
export class VoucherModule {}
