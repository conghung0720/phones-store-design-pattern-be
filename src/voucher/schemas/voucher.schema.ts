import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsPositive } from 'class-validator';
import { HydratedDocument, Types } from 'mongoose';

// export type UserDocument = HydratedDocument<User>;

@Schema()
export class Voucher {
  @Prop({
    required: true,
    min: 1,
    max: 100
  })
  priceSale: number;

  @Prop({
    required: true,
  })
  userUsed: []

  @Prop({
    require: true,
  })
  nameVoucher: string;

  @Prop({
    require: true,
    default: 'Không có mô tả',
    length: 1000,
  })
  description: string;

  @Prop({ require: true })
  maxPriceSale: number;

  @Prop({
    required: true,
    min: 0
  })
  quantity: number;

  @Prop({
    require: true,
  })
  codeVoucher: string;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
