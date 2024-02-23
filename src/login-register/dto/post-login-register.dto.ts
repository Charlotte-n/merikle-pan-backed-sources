//封装接受的参数的
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

/**
 * 验证码
 */
export class PostCaptcha {
  @MinLength(4, {
    message: '验证码不能少于4位',
  })
  captcha: string;
}

export class PostCode {
  @IsEmail()
  email: string;
  code: string;
}

/**
 * 登录
 */
export class PostLogin {
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
  is_remember: number;
}
export interface PostLoginType {
  email: string;
  password: string;
  is_remember: number;
}

/**
 * 注册
 */
export class PostRegisterv {
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  nick_name: string;
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
  @IsNotEmpty({
    message: '第二次密码不能为空',
  })
  twicePassword: string;
}

export interface PostRegistervType {
  email: string;
  nick_name: string;
  password: string;
  twicePassword: string;
}
