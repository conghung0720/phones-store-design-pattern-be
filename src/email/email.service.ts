import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { formattedPrice } from 'src/utils/formatPrice';
import { checkoutTemplate } from './templates/checkout.template';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // replace with your Gmail email
      pass: process.env.PASSWORD_EMAIL
    },
  });

  async sendOrderConfirmationEmail(checkoutInfo) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: checkoutInfo.email,
      subject: 'Kiểm tra thông tin đơn hàng',
      html: checkoutTemplate(checkoutInfo),
    };
  
    await this.transporter.sendMail(mailOptions);
  }
  
}
