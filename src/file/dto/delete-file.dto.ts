import { IsNotEmpty } from 'class-validator';

export class DeleteFileorFolderDto {
  fileId: string;
  @IsNotEmpty()
  filePid: string;
  @IsNotEmpty({ message: '文件夹不能为空' })
  filename: string;
}
