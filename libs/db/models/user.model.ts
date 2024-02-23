import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  nick_name: string;

  @Prop({
    unique: true,
    required: true,
  })
  email: string;

  @Prop({
    unique: true,
    required: true,
  })
  qq_open_id: number; //qq_id,0为没有qq授权过

  @Prop()
  qq_avatar: string; //qq头像

  @Prop()
  password: string; //密码

  @Prop()
  create_time: Date; //创建时间

  @Prop()
  last_time: Date; //最后登录时间

  @Prop()
  status: number; //是否删除

  @Prop()
  isAdmin: number; //0为普通用户，1为管理员

  @Prop()
  useSpace: number; //使用的空间多大

  @Prop()
  assess_Token: string;
  @Prop()
  is_remember: number; //0为记住，1为记不住
}

export const UserSchema = SchemaFactory.createForClass(User);
