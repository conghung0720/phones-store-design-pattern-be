import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schema';
import { Model, Types } from 'mongoose';
import { ProductDto } from './dto/product.dto';
import { NotFoundError } from 'rxjs';
import { OrderdetailService } from 'src/orderdetail/orderdetail.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { ProductBuilder } from './product-builder.builder';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(FavoriteProduct.name)
    private favoriteModel: Model<FavoriteProduct>,
    private orderDetailService: OrderdetailService,
    private userService: UserService,
    private notificationService: NotificationObserver,
  ) {}

  async create(product: ProductDto) {
    const builder = new ProductBuilder();
    const builtProduct = builder
      .setName(product.name)
      .setQuantitySold(product.quantity_sold)
      .setDescription(product.description)
      .setAttributes(product.attributes)
      .setHighlights(product.highlights)
      .setMainImage(product.main_image)
      .setBrand(product.brand)
      .build();
  
    const newItem = await this.productModel.create(builtProduct);
  
    if (!newItem) throw new ConflictException('Lỗi khi tạo sản phẩm');
  
    return {
      message: 'Tạo mới sản phẩm thành công',
      status: 201,
      metadata: product,
    };
  }

  async listPros() {
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

  async getProductById({ idProduct }) {
    const foundProduct: any = await this.productModel.findById(idProduct);
    if (!foundProduct) throw new BadGatewayException('Không tìm thấy sản phẩm');
    const comments: any = foundProduct.comments || [];

    for (const [index, comment] of comments.entries()) {
      const user: any = await this.userService.findByUserId(comment.userId);
      foundProduct.comments[index].userId = user;
    }
    return foundProduct;
  }

  async getSubProductById({
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
    const { _id, ...productChange } = product;
    const foundProduct = await this.productModel.findById(
      new Types.ObjectId(_id),
    );
    if (!foundProduct) throw new ConflictException('Không tìm thấy sản phẩm');
    if (
      product?.attributes[0].price &&
      product.attributes[0].price < foundProduct.attributes[0].price
    ) {
      await this.notificationService.notify(product._id);
    }
    await this.updatePriceFavorite(_id, productChange.price);
    return await this.productModel.updateOne({ _id }, productChange);
  }

  async commentProduct(product) {
    const foundOrderDetailSuccess =
      await this.orderDetailService.isOrderDetailSuccess({
        userId: product.userId,
        productId: product.productId,
      });

    if (!foundOrderDetailSuccess)
      throw new ForbiddenException(
        'Bạn không thể đánh giá vì chưa mua sản phẩm',
      );

    const foundProduct = await this.productModel.find(
      new Types.ObjectId(product.productId),
    );
    const foundComment = foundProduct.flatMap((val) => val.comments);

    const checkExistComment = foundComment.some((val: any) => {
      return val.userId.toString() === product.userId.toString();
    });

    if (checkExistComment)
      throw new ForbiddenException('Bạn đã bình luận sản phẩm này rồi');

    const filter = { _id: product.productId },
      update = {
        $push: {
          comments: { ...product, userId: new Types.ObjectId(product.userId) },
        },
      },
      options = { new: true, upsert: true };
    return await this.productModel.findByIdAndUpdate(filter, update, options);
  }

  async checkFavoriteByProductIdAndUserId(
    productId: string,
    userId: string,
  ): Promise<boolean> {
    const favorite = await this.favoriteModel
      .findOne({ product: new Types.ObjectId(productId) })
      .exec();
    if (!favorite) {
      return !!favorite;
    }

    const userIdObj = new Types.ObjectId(userId);
    const isFavorite = favorite.users_favorited.includes(userIdObj);
    return isFavorite;
  }

  async getFavoriteByProductId(productId: string) {
    const favorite = await this.favoriteModel.findOne({ productId }).exec();
    if (!favorite) throw new BadRequestException('Favorite not found');
    return favorite;
  }

  async createFavorite(productId: string, price = 0) {
    const favorite = await this.favoriteModel.create({
      users_favorited: [],
      product: new Types.ObjectId(productId),
      current_price: price,
      old_price: price,
    });
    if (!favorite) throw new BadRequestException('Favorite not created');
    return favorite;
  }

  async updateFavorite(productId: string, userId: string) {
    const favorite = await this.favoriteModel
      .findOne({ product: new Types.ObjectId(productId) })
      .exec();
    if (!favorite) throw new BadRequestException('Favorite not found');

    favorite.users_favorited.push(new Types.ObjectId(userId));
    return await favorite.save();
  }

  async updatePriceFavorite(productId: string, newPrice: number) {
    const favorite = await this.favoriteModel
      .findOne({ product: new Types.ObjectId(productId) })
      .exec();
    if (!favorite) {
      return;
    }

    favorite.old_price = favorite.current_price;
    favorite.current_price = newPrice;
    return await favorite.save();
  }
  async updateUserFavorite(
    productId: string,
    userId: string,
    isFavorite: boolean,
  ) {
    const favorite = await this.favoriteModel
      .findOne({ product: new Types.ObjectId(productId) })
      .exec();
    if (!favorite) throw new BadRequestException('Favorite not found');

    const userIdObj = new Types.ObjectId(userId);
    const index = favorite.users_favorited.indexOf(userIdObj);
    if (isFavorite) {
      if (index === -1) {
        await this.notificationService.subscribe(userId, productId);
        favorite.users_favorited.push(userIdObj);
      }
    } else {
      if (index > -1) {
        await this.notificationService.unSubscribe(userId, productId);
        favorite.users_favorited.splice(index, 1);
      }
    }

    return await favorite.save();
  }

  async deleteFavorite(productId: string, userId: string) {
    const favorite = await this.favoriteModel.findOne({ productId }).exec();
    if (!favorite) throw new BadRequestException('Favorite not found');

    const index = favorite.users_favorited.indexOf(new Types.ObjectId(userId));
    if (index > -1) {
      favorite.users_favorited.splice(index, 1);
    }

    return await favorite.save();
  }

  async createV2(product: ProductDto) {
    const builder = new ProductBuilder();
    const builtProduct = builder
      .setName(product.name)
      .setQuantitySold(product.quantity_sold)
      .setDescription(product.description)
      .setAttributes(product.attributes)
      .setHighlights(product.highlights)
      .setMainImage(product.main_image)
      .setBrand(product.brand)
      .build();
  
    const newItem = await this.productModel.create(builtProduct);
  
    if (!newItem) throw new ConflictException('Lỗi khi tạo sản phẩm');
  
    return {
      message: 'Tạo mới sản phẩm thành công',
      status: 201,
      metadata: product,
    };
  }

}
