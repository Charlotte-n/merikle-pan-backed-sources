import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpException,
  HttpStatus,
  Inject,
  Query,
} from '@nestjs/common';
import { LoginRegisterService } from './login-register.service';
import {
  PostCaptcha,
  PostCode,
  PostLogin,
  PostRegisterv,
} from './dto/post-login-register.dto';
import { RedisService } from '@Libs/redis';
import { EmailSendService } from '../email-send/email-send.service';
import { JwtService } from '@nestjs/jwt';
import { PostPasswordDto } from './dto/post-password.dto';
import * as svgCaptcha from 'svg-captcha';
import { md5 } from '../utils';

@Controller('lr')
export class LoginRegisterController {
  @Inject(RedisService)
  private readonly redisService: RedisService;
  @Inject(EmailSendService)
  private readonly emailService: EmailSendService;
  constructor(private readonly loginRegisterService: LoginRegisterService) {}

  //注入JWT
  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('qq_login')
  qqLogin() {}

  /**
   * 邮箱登录
   * @param body
   * @param respon
   */
  @Post('login')
  async login(@Body() body: PostLogin, @Res({ passthrough: true }) respon) {
    const { result } = await this.loginRegisterService.login(body);
    const { password } = body;
    try {
      if (result) {
        console.log(
          md5(password) === result.password,
          password,
          result.password,
        );
        if (md5(password) === result.password) {
          const token = await this.jwtService.signAsync({
            id: result._id,
            nick_name: result.nick_name,
          });
          respon.setHeader('token', JSON.stringify(token));
          return {
            data: {
              _id: result._id,
              email: result.email,
              qq_open_id: result.qq_open_id,
              nick_name: result.nick_name,
              create_time: result.create_time,
              token: token,
              password: result.password,
              is_remember: result.is_remember,
              avatar: result.qq_avatar,
            },
            message: '登录成功',
            code: 0,
          };
        } else {
          return {
            message: '密码输错了',
            code: 1,
          };
        }
      } else {
        return {
          message: '没有注册',
          code: 1,
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 注册
   * @param body
   */
  @Post('register')
  register(@Body() body: PostRegisterv) {
    return this.loginRegisterService.register(body);
  }

  /**
   * 重置密码
   * @param body
   */
  @Patch('reset-password')
  resetPassword(@Body() body: PostPasswordDto) {
    return this.loginRegisterService.resetPassword(body);
  }

  /**
   * 获取邮箱验证码
   * @param address
   */
  @Get('register-code')
  async generateRegisterCode(@Query() address: string) {
    const code = Math.random().toString().slice(2, 8);
    try {
      //设置缓存
      await this.redisService.set(`verify_code`, code, 5 * 60);
      await this.emailService.sendMail({
        to: address,
        subject: 'merikle网盘注册验证码',
        html: `<p>你的注册验证码是 ${code}</p>`,
      });
      return this.loginRegisterService.generateCode();
    } catch (e) {
      return {
        code: 1,
        message: '发送失败，邮箱不正确',
      };
    }
  }

  /**
   * 验证邮箱验证码
   * @param body
   */
  @Post('verifyCode')
  async verifyCode(@Body() body: PostCode) {
    //获取缓存里面的验证码
    const code = await this.redisService.get('verify_code');
    if (!code) {
      return this.loginRegisterService.verifyCode({
        data: '',
        code: 1,
        message: '验证码失效',
      });
    }
    if (code !== body.code || !body.code) {
      return this.loginRegisterService.verifyCode({
        data: '',
        code: 2,
        message: '验证失败',
      });
    }
    return this.loginRegisterService.verifyCode({
      data: '',
      code: 0,
      message: '验证成功',
    });
  }

  /**
   * 验证图片验证码
   * @param body
   */
  @Post('verifyCaptcha')
  async verifyCaptcha(@Body() body: PostCaptcha) {
    const { captcha } = body;
    const myCaptcha = await this.redisService.get('captcha');
    if (!myCaptcha) {
      return this.loginRegisterService.verifyCaptcha({
        data: '',
        code: 1,
        message: '验证失效',
      });
    }
    if (captcha.toLowerCase() !== myCaptcha.toLowerCase() || !captcha) {
      return this.loginRegisterService.verifyCaptcha({
        data: '',
        code: 1,
        message: '验证失败',
      });
    }
    return this.loginRegisterService.verifyCaptcha({
      data: '',
      code: 0,
      message: '验证成功',
    });
  }

  /**
   * 生成验证码
   * @param id
   * @param res
   */
  @Get(':id')
  findOne(@Param('id') id: string, @Res({ passthrough: true }) res) {
    switch (id) {
      case 'captcha':
        const captcha = svgCaptcha.create({
          //可配置返回的图片信息
          size: 4, //生成几个验证码
          fontSize: 50, //文字大小
          width: 100, //宽度
          height: 40, //高度
          background: '#cc9966', //背景颜色
        });
        // 将验证码文本存储在会话或数据库中，以便后续验证，准备存入redis
        this.redisService.set('captcha', captcha.text);
        res.set('Content-Type', 'image/svg+xml');
        res.send(captcha.data);
    }
  }
}
