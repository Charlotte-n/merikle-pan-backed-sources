import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';

export type CommonFileDocument = HydratedDocument<File>;

@Schema()
export class CommonFile {
  //编辑权限
  @Prop()
  isPrivate: boolean;
  @Prop()
  createTime: string;
  @Prop()
  EditCount: number;
  @Prop()
  isDelete: boolean;
  @Prop()
  isEdit: boolean;
  @Prop()
  content: [];
  @Prop()
  category: string;
  @Prop()
  name: string;
  @Prop()
  userId: string;
  @Prop()
  editTime: string;
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
}

export const CommonFileSchema = SchemaFactory.createForClass(CommonFile);
