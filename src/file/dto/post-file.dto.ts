import { IsNotEmpty } from 'class-validator';

export interface AddFileOrFolderDtoType {
  fileId: string;
  filePid: string;
  filename: string;
}

export class AddFileOrFolderDto {
  fileId: string;
  @IsNotEmpty()
  filePid: string;
  @IsNotEmpty({ message: '文件夹不能为空' })
  name: string;
  @IsNotEmpty()
  user_id: string;
}

export class RenameDto {
  @IsNotEmpty()
  filename: string;
}

export class mergeParam {
  @IsNotEmpty()
  fileHash: string;
  filename: string;
  @IsNotEmpty()
  fileSize: number;
  user_id: string;
  file_type: string;
  filePid: string | number;
  ext: string;
}

export class AddFile {
  filename: string;
  hash: string;
  fileId: string;
  parentId: string;
  url: string;
}
