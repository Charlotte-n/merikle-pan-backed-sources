import { IsNotEmpty } from 'class-validator';

export class DeleteFileorFolderDto {
  fileId: string;
}

//批量删除
export class MultipleDeleteDto {
  @IsNotEmpty({ message: '不能为空' })
  ids: string[];
}
