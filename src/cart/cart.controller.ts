import { Body, Controller, Param, Post, Get } from '@nestjs/common';
import { CartService } from './cart.service';
import { ProductToCartDto } from 'src/product/dto/product.dto';
import { DeleteItemDto, ItemToCartDto } from './dto/cart.dto';
import { info } from 'console';
import { UserDecorator } from 'src/user/Decorator/User.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  async addToCart(@Body() item: ItemToCartDto) {
    return await this.cartService.addToCart({
      userId: item.userId,
      product: item,
    });
  }

  @Post('update')
  async updateItemCart(@Body() infoUpdate) {
    const { userId, ...product } = infoUpdate;
    return await this.cartService.updateQuantityItemCart(userId, product);
  }

  @Post('delete')
  async removeItemInCart(@Body() item: DeleteItemDto) {
    const { userId, cartId, ...infoItem } = item;
    return await this.cartService.deleteItemCart({ userId, cartId }, infoItem);
  }

  @Get('findCart/:userId')
  async findCartByUserId(@Param('userId') userId) {
    return await this.cartService.findCartByUserId(userId);
  }

  @Get('findCart')
  async findCart(@UserDecorator() user){
      return await this.cartService.findCartByUserId(user._id);
  }

  @Post('newCart')
  async newCart(@Body() newCart){
    return await this.cartService.newUserCartAndUpdateItem(newCart)
  }
}
