import { Injectable } from '@nestjs/common';
import { createTransport, Transporter } from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailSendService {
  transporter: Transporter;
  constructor(private configService: ConfigService) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer_host'),
      port: this.configService.get('nodemailer_port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer_auth_user'),
        pass: this.configService.get('nodemailer_auth_pass'),
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
