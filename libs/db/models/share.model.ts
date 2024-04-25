import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { File } from './file_info.model';

export type ShareDocment = HydratedDocument<File>;

@Schema()
export class Share {
  @Prop()
  file_id: string;
  @Prop()
  user_id: string;
  @Prop()
  valid_type: number; //有效期类型
  @Prop()
  expire_time: number;
  @Prop()
  share_time: number;
  @Prop()
  code: string;
  @Prop()
  show_count: number; //浏览次数
  @Prop()
  userId: string;
  @Prop({ type: mongoose.Types.ObjectId, ref: 'File' })
  file: mongoose.Types.ObjectId;
}
export const ShareSchema = SchemaFactory.createForClass(Share);
