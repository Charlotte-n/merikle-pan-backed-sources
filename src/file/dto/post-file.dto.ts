import { IsNotEmpty } from 'class-validator';

export interface AddFileOrFolderDtoType {
  fileId: string;
  filePid: string;
  filename: string;
}

export class AddFileOrFolderDto {
  @IsNotEmpty()
  fileId: string;
  @IsNotEmpty()
  filePid: string;
  @IsNotEmpty()
  filename: string;
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
}
