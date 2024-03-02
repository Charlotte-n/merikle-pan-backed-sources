import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from './user.model';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop()
  file_id: string;
  @Prop()
  file_md5: string; //MD5
  @Prop()
  file_pid: string; //父级别
  @Prop()
  file_size: number; //文件大小
  @Prop()
  file_name: string; //文件名字
  @Prop()
  file_cover: string; //文件封面
  @Prop()
  file_path: string; //文件的路径
  @Prop()
  create_time: string;
  @Prop()
  last_update_time: string; //文件更新时间
  @Prop()
  folder_type: number; //0为文件，1为目录
  @Prop()
  file_category: number; //1为视频，2为音频，3为图片，4为文档，5为其他
  @Prop()
  file_type: number; //1为视频，2为音频，3为图片，4为pdf，5为doc，6为excel，7：txt，8:code,9:zip,10:其他
  @Prop()
  status: number; //1转码中，2转码失败，3转码成功
  @Prop()
  del_time: string; //进入回收站时间
  @Prop()
  del_flag: number; //删除标记，0：为删除，1为回收站，2为正常
  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  user: mongoose.Types.ObjectId;
}

export const FileSchema = SchemaFactory.createForClass(File);
