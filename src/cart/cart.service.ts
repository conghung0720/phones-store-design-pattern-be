import { ConflictException, Injectable } from '@nestjs/common';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ProductService } from 'src/product/product.service';
import { ProductDto, ProductToCartDto } from 'src/product/dto/product.dto';
import { ItemToCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<Cart>,
  ) {}

  async newUserCartAndUpdateItem({ userId, product, priceSale = 0, percentSale = 0 }) {
    const itemsCart = Object.keys(product).length === 0 ? [] : [product];
  
    const query = { user: userId },
      update = {
        price_sale: priceSale,
        percent_sale: percentSale, 
        $addToSet: {
          items_cart: { $each: itemsCart },
        },
      },
      options = { upsert: true, new: true };

    return await this.cartModel.findOneAndUpdate(query, update, options);
  }
  

  async updateQuantityItemCart(userId, product) {
    const { id, quantity, productId, price, old_quantity } = product;

    let query = {
        user: userId,
        'items_cart':{
          $elemMatch: {
            productId,
            id
          }
        }
      },
      options = { upsert: true, new: true };

    const updateSetV2 = {}

    const newQuantity = old_quantity + quantity;
    const updateSet =
      newQuantity <= 0
        ? {
            $pull: { items_cart: { id, productId } },
          }
        : {
            $inc: {
              'items_cart.$.price': +price,
              'items_cart.$.quantity': +quantity,
            },
          };
    await this.cartModel.findOneAndUpdate(query, updateSet, options);
    return await this.totalPriceCart({ userId });
  }

  async totalPriceCart({ userId }) {
    const foundCart = await this.findCartByUserId(userId);
    if (!foundCart) throw new ConflictException('Không tìm thấy giỏ hàng');

    const totalPrice = await foundCart.items_cart.reduce(
      (acc, value) => value.price + acc,
      0,
    );

    const updateSet = {
        $set: {
          total_price_cart: totalPrice,
        },
      },
      query = { user: userId },
      upsert = { upsert: true, new: true };

    return await this.cartModel.findOneAndUpdate(query, updateSet, upsert);
  }

  async findItemInCart({ userId, cartId, product }) {
    const findCart = await this.cartModel.findOne({
      user: userId,
      _id: cartId,
    });
    if (!findCart) throw new ConflictException('Không tìm thấy giỏ hàng');

    const foundItem = findCart.items_cart.find(
      (item) => item.id === product.id && item.productId === product.productId,
    );
    return foundItem;
  }

  async addToCart({ userId, product }) {
    const userCart = await this.cartModel.findOne({ user: userId }).exec();
    if (!userCart) {
      await this.newUserCartAndUpdateItem({ userId, product });
      return await this.totalPriceCart({ userId });
    }

    if (!userCart.items_cart.length) {
      await this.cartModel.updateOne({ user: userId, items_cart: product });
      return await this.totalPriceCart({ userId });
    }

    if (
      userCart.items_cart.length &&
      !(await this.findItemInCart({ userId, cartId: userCart._id, product }))
    ) {
      await this.newUserCartAndUpdateItem({ userId, product });
      return await this.totalPriceCart({ userId });
    }
    await this.totalPriceCart({ userId });

    return await this.updateQuantityItemCart(userId, product);
  }

  async findCartByUserId(userId) {
    return await this.cartModel.findOne({ user: userId }).exec();
  }

  async deleteAllItemCart({ userId, cartId }) {
    const query = { user: userId },
      update = {
        $set: {
          items_cart: [],
        },
        percent_sale: 0,
        total_price_cart: 0,
        price_sale: 0
      },
      options = { upsert: true, new: true };
    return await this.cartModel.findOneAndUpdate(query, update, options);
  }

  async deleteItemCart({ userId, cartId }, product) {
    const { productId, id } = product;
    const findItem = await this.findItemInCart({ userId, cartId, product });
    if (!findItem) throw new ConflictException('Không tìm thấy sản phẩm');

    const query = { user: userId, _id: cartId },
      updateSet = {
        $pull: {
          items_cart: { productId, id },
        },
      },
      options = { new: true, upsert: true };

    return await this.cartModel.findOneAndUpdate(query, updateSet, options);
  }
}
