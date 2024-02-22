import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  HttpException,
  HttpStatus,
  Inject,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { LoginRegisterService } from './login-register.service';
import { CreateLoginRegisterDto } from './dto/create-login-register.dto';
import { UpdateLoginRegisterDto } from './dto/update-login-register.dto';
import {
  PostCaptcha,
  PostCode,
  PostLogin,
  PostRegisterv,
} from './dto/post-login-register.dto';
import { RedisService } from '@Libs/redis';
import { EmailSendService } from '../email-send/email-send.service';
import { JwtService } from '@nestjs/jwt';
import { ResponseInterfator } from '../response-interfator.interface';
import { ConfigService } from '@nestjs/config';

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

  @Post()
  create(@Body() createLoginRegisterDto: CreateLoginRegisterDto) {
    return this.loginRegisterService.create(createLoginRegisterDto);
  }

  /**
   * 登录
   * @param body
   * @param respon
   */
  @UseInterceptors(ResponseInterfator)
  @Post('login')
  async login(@Body() body: PostLogin, @Res({ passthrough: true }) respon) {
    const { result, isEmail } = await this.loginRegisterService.login(body);
    try {
      if (result && isEmail) {
        //登录成功，将token放在请求头上
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
          },
          message: '登录成功',
          code: 0,
        };
      } else if (isEmail) {
        if (!result) {
          return {
            message: '密码输错了',
            code: 0,
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
   * 获取邮箱验证码
   * @param address
   */
  @Get('register-code')
  async generateRegisterCode(@Query() address: string) {
    const code = Math.random().toString().slice(2, 8);
    //设置缓存
    await this.redisService.set(`code_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: 'merikle网盘注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return this.loginRegisterService.generateCode();
  }

  /**
   * 验证邮箱验证码
   * @param body
   */
  @Post('verifyCode')
  async verifyCode(@Body() body: PostCode) {
    //获取缓存里面的验证码
    const code = await this.redisService.get(`code_${body.code}`);
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
    if (captcha !== myCaptcha || !captcha) {
      return this.loginRegisterService.verifyCaptcha({
        data: '',
        code: 1,
        message: '验证失败',
      });
    }
    return this.loginRegisterService.verifyCaptcha({
      data: '',
      code: 0,
      message: '请求成功',
    });
  }
  @Get()
  findAll() {
    return this.loginRegisterService.findAll();
  }
  @Get(':id')
  findOne(@Param('id') id: string, @Res() res) {
    switch (id) {
      case 'captcha':
        return this.loginRegisterService.generateImageCode(res);
    }
    return this.loginRegisterService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.loginRegisterService.remove(+id);
  }
}
