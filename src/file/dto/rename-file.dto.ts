import { IsNotEmpty } from 'class-validator';

export class RenameFileDto {
  @IsNotEmpty({ message: '文件名不能为空' })
  filename: string;
  @IsNotEmpty()
  _id: string;
}
