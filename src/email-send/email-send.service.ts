import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSendService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false,
      auth: {
        user: '3495314473@qq.com',
        pass: 'jwcpfwcklvidcjea',
      },
    });
  }
  async sendMail({ to, subject, html }) {
    await this.transporter.sendMail({
      from: {
        name: 'merikle网盘注册',
        address: '3495314473@qq.com',
      },
      to,
      subject,
      html,
    });
  }
}
