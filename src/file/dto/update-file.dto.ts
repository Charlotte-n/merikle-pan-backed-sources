export class UploadFileDto {
  chunkIndex: number;
  fileHash: string;
  filename: string;
}

export interface UploadFileDtoType {
  chunk: Express.Multer.File;
  chunkInfo: { chunkIndex: number; fileHash: string; uploadUrl: string };
}
