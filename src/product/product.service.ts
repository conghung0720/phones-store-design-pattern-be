import {
  BadGatewayException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { NotFoundError } from 'rxjs';
import { OrderDetailService } from 'src/orderdetail/orderdetail.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private orderDetailService: OrderDetailService,
    private userService: UserService
  ) { }

  async create(product: ProductDto) {
    const idsAttribute = product.attributes.map((value, index) => {
      return {
        id: index,
        ...value,
      };
    });
    const newItem = await this.productModel.create({
      ...product,
      attributes: idsAttribute,
    });
    if (!newItem) throw new ConflictException('Lỗi khi tạo sản phẩm');

    return {
      message: 'Tạo mới sản phẩm thành công',
      status: 201,
      metadata: product,
    };
  }

  async getAll() {
    const listItems = await this.productModel.find().exec();
    if (!listItems) throw new ConflictException('Không tìm thấy sản phẩm');

    return listItems;
  }

  async deleteProductById({ productId }) {
    return await this.productModel.findOneAndDelete({ _id: productId });
  }

  async updateQuantityProduct({ productId, productAttrId, quantityChange }) {
    const query = { _id: productId, 'attributes.$[].id': productAttrId },
      update = {
        $inc: {
          'attributes.$[].quantity': quantityChange,
        },
      },
      options = { upsert: true };

    return await this.productModel.findOneAndUpdate(query, update, options);
  }

  async countQuantItemById(idItem, idAttr) {
    const { attributes } = await this.productModel.findById(idItem).exec();
    if (!attributes) throw new Error('Lỗi không tìm thấy item');

    const quantity = await attributes.filter((item) => {
      if (item.id === idAttr) return item.quantity;
      else return 0;
    });
    return quantity;
  }

  async getById({ idProduct }) {
    const foundProduct: any = await this.productModel.findById(idProduct);
    if (!foundProduct) throw new BadGatewayException('Không tìm thấy sản phẩm');
    const comments: any = foundProduct.comments || [];

    for (const [index, comment] of comments.entries()) {
      const user: any = await this.userService.getById(comment.userId)
      foundProduct.comments[index].userId = user
    }
    return foundProduct;
  }

  async findSubProductById({
    idProduct,
    idAttr,
  }: {
    idProduct: Types.ObjectId;
    idAttr: Number;
  }) {
    const foundProduct = await this.productModel.findById(idProduct).exec();
    if (!foundProduct) throw new BadGatewayException('Không tìm thấy sản phẩm');

    return foundProduct.attributes.find((value) => value.id === idAttr);
  }

  async editProductById(product) {
    const { _id, ...productChange } = product
    const foundProduct = await this.productModel.findById(new Types.ObjectId(_id))
    if (!foundProduct) throw new ConflictException('Không tìm thấy sản phẩm')

    return await this.productModel.updateOne({ _id }, productChange)
  }

  async commentProduct(product) {
    const foundOrderDetailSuccess = await this.orderDetailService
      .isOrderDetailSuccess({ userId: product.userId, productId: product.productId })

    if (!foundOrderDetailSuccess) throw new ForbiddenException('Bạn không thể đánh giá vì chưa mua sản phẩm')

    const foundProduct = await this.productModel.find(new Types.ObjectId(product.productId))
    const foundComment = foundProduct.flatMap(val => val.comments)

    const checkExistComment = foundComment.some((val: any) => {
      return val.userId.toString() === product.userId.toString()
    });

    if (checkExistComment) throw new ForbiddenException("Bạn đã bình luận sản phẩm này rồi")

    const filter = { _id: product.productId }, update = { $push: { comments: { ...product, userId: new Types.ObjectId(product.userId) } } }, options = { new: true, upsert: true }
    return await this.productModel.findByIdAndUpdate(filter, update, options)
  }
}
