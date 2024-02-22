import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateLoginRegisterDto } from './dto/create-login-register.dto';
import * as svgCaptcha from 'svg-captcha';
import { RedisService } from '@Libs/redis';
import { ResponsePrams } from '../common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';
import {
  PostLoginType,
  PostRegistervType,
} from './dto/post-login-register.dto';

@Injectable()
export class LoginRegisterService {
  @Inject(RedisService)
  private readonly redisService: RedisService;
  //导入User模型
  @InjectModel(User.name)
  private readonly User: Model<User>;

  create(createLoginRegisterDto: CreateLoginRegisterDto) {
    return 'This action adds a new loginRegister';
  }

  /**
   * 登录
   * @param body
   */
  async login(body: PostLoginType) {
    const { email, password } = body;
    const isEmail = await this.User.findOne({ email });
    const result = await this.User.findOne({ email, password });
    return {
      result,
      isEmail,
    };
  }

  /**
   * 邮箱注册
   * @param body
   */
  async register(body: PostRegistervType) {
    const { email, nick_name, password, code, captcha } = body;
    try {
      if (email && nick_name && password && captcha && code) {
        await this.User.create({
          email,
          nick_name,
          password,
          qq_open_id: 0,
          create_time: new Date(),
        });
        return {
          data: '',
          message: '注册成功',
          code: 0,
        };
      } else {
        return {
          data: '',
          message: '注册失败',
          code: 1,
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  generateCode() {
    return {
      data: '',
      message: '发送成功',
      code: 0,
    };
  }

  findAll() {
    return `This action returns all loginRegister`;
  }

  findOne(id: number) {
    return `This action returns a #${id} loginRegister`;
  }

  remove(id: number) {
    return `This action removes a #${id} loginRegister`;
  }

  /**
   * 生成验证码
   * @param res
   */
  generateImageCode(res: any) {
    const captcha = svgCaptcha.create({
      //可配置返回的图片信息
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    // 将验证码文本存储在会话或数据库中，以便后续验证，准备存入redis
    this.redisService.set('captcha', captcha.text, 60);
    res.set('Content-Type', 'image/svg+xml');
    res.send(captcha.data);
  }
  verifyCaptcha(value: ResponsePrams) {
    const { data, code, message } = value;
    return { data, code, message };
  }

  verifyCode(value: ResponsePrams) {
    const { data, code, message } = value;
    return { data, code, message };
  }
}
