//忘记密码

import { IsEmail, IsNotEmpty } from 'class-validator';

export class PostPasswordDto {
  @IsEmail(
    {},
    {
      message: '邮箱格式不正确',
    },
  )
  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @IsNotEmpty({
    message: '第二次密码不能为空',
  })
  password: string;
}

export interface PostPasswordDtoType
  extends Pick<PostPasswordDto, 'email' | 'password'> {
  email: string;
  password: string;
}
