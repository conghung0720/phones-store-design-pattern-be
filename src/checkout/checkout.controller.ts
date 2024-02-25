import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private checkoutService: CheckoutService) {}

  @Post()
  async checkoutCart(@Body() infoCheckout: CheckoutDto) {
    // console.log(infoCheckout);
    return await this.checkoutService.reviewCheckout(infoCheckout);
  }
}
