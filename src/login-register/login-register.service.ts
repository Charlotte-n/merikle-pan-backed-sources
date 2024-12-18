import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { RedisService } from '@Libs/redis';
import { ResponsePrams } from '../common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../../libs/db/models/user.model';
import { Model } from 'mongoose';
import {
  PostLoginType,
  PostRegistervType,
} from './dto/post-login-register.dto';
import { PostPasswordDtoType } from './dto/post-password.dto';
import { md5 } from '../utils';

@Injectable()
export class LoginRegisterService {
  @Inject(RedisService)
  private readonly redisService: RedisService;
  //导入User模型
  @InjectModel(User.name)
  private readonly User: Model<User>;

  /**
   * 登录
   * @param body
   */
  async login(body: PostLoginType) {
    const { email, is_remember } = body;
    const result = await this.User.findOne({ email });
    await this.User.updateOne({ email: email }, { is_remember });

    return {
      result,
    };
  }

  /**
   * 邮箱注册
   * @param body
   */
  async register(body: PostRegistervType) {
    const { email, nick_name, password } = body;
    try {
      console.log(email, nick_name);
      if (email && nick_name && password) {
        await this.User.create({
          email,
          nick_name,
          password: md5(password),
          qq_open_id: 0,
          create_time: new Date(),
          totalSpace: 20,
          useSpace: 0,
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

  /**
   * 重置密码
   */
  async resetPassword(body: PostPasswordDtoType) {
    const { email, password } = body;
    //寻找email
    const res = await this.User.findOne({ email });
    if (!res) {
      throw new HttpException('没有该用户', HttpStatus.BAD_REQUEST);
    } else {
      try {
        await this.User.updateOne({ email }, { password: md5(password) });
        return {
          message: '修改成功',
          code: 0,
        };
      } catch (e) {
        throw new HttpException(e, HttpStatus.FAILED_DEPENDENCY);
      }
    }
  }

  generateCode() {
    return {
      data: '',
      message: '发送成功',
      code: 0,
    };
  }

  findOne(id: number) {
    return `This action returns a #${id} loginRegister`;
  }

  verifyCaptcha(value: ResponsePrams) {
    const { data, code, message } = value;
    return { data, code, message };
  }

  verifyCode(value: ResponsePrams) {
    const { data, code, message } = value;
    return { data, code, message };
  }

  updateIsNumber(email: string, updateValue) {
    this.User.updateOne({ email: email }, { is_remember: updateValue });
  }
}
