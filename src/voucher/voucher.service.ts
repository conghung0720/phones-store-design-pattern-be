import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Voucher } from './schemas/voucher.schema';
import { Model, SchemaTypes, Types } from 'mongoose';
import { VoucherDto } from './dto/d';

@Injectable()
export class VoucherService {
    constructor(@InjectModel(Voucher.name) private voucherModel: Model<Voucher>) {}

    async newVoucher(voucher: VoucherDto) {
        const foundCodeVoucher = await this.voucherModel.findOne({ codeVoucher: voucher.codeVoucher })
        if(foundCodeVoucher) throw new HttpException('Không được đặt trùng code voucher', 402);
        const newVoucher = await this.voucherModel.create(voucher)
        
        return newVoucher;
    }

    async useVoucher({ userId, codeVoucher }) {
        const foundVoucher : any = await this.voucherModel.findOne({ codeVoucher }).exec()
        const foundUserUsed = foundVoucher?.userUsed.some(user => user === userId);

        if(foundUserUsed) throw new HttpException('Bạn đã sử dụng voucher này', 406)

        const checkQuantity = +foundVoucher.quantity;
        if(checkQuantity <= 0) throw new HttpException('Số lượng voucher đã hết', 403)

        const filter = { codeVoucher }, update = { $push: { userUsed: userId}, $inc: { quantity: -1 } }, options = { upsert: true };
        return await this.voucherModel.findOneAndUpdate(filter, update, options).exec()
    }

    async voucherList() {
        return await this.voucherModel.find();
    }

    async removeVoucherById(voucherId) {
        const foundVoucher = await this.voucherModel.findOne( {_id: new Types.ObjectId(voucherId)} );
        if(!foundVoucher) throw new HttpException('Không tìm thấy id voucher' , 403)
        
        return await this.voucherModel.deleteOne( {_id: new Types.ObjectId(voucherId) })

    }

    async editVoucher(voucher){
        const foundVoucher = await this.voucherModel.findOne({ _id: new Types.ObjectId(voucher._id)})
        if(!foundVoucher) throw new HttpException('Không tìm thấy voucher', 403)
    
        const filter = { _id: new Types.ObjectId(voucher._id)}, options = { upsert: true }
        return await this.voucherModel.findOneAndUpdate(filter, voucher, options).exec();
    }

    async findVoucherByVoucherName(voucherName) {
        const foundVoucher = await this.voucherModel.findOne({ codeVoucher: voucherName });
        
        if(!foundVoucher) throw new HttpException('Không tìm thấy voucher này!', 403)

        return foundVoucher;
    }

}
