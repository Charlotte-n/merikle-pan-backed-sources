import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class PostCaptcha {
  @MinLength(4, {
    message: '验证码不能少于4位',
  })
  captcha: string;
}

export class PostCode {
  code: string;
}
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
  @MinLength(4, {
    message: '验证码不能少于4位',
  })
  captcha: string;
}
export interface PostLoginType {
  email: string;
  password: string;
  captcha: string;
}

export class PostRegisterv {
  @IsEmail(
    {},
    {
      message: '不是合法的邮箱格式',
    },
  )
  email: string;
  captcha: string;
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
  twicepassword: string;
  code: string;
  qq_open_id: number;
}

export interface PostRegistervType {
  email: string;
  captcha: string;
  nick_name: string;
  password: string;
  twicepassword: string;
  code: string;
  qq_open_id: number;
}

export class PostRegister {}
