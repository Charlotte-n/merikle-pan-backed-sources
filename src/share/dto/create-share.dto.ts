export class CreateShareDto {
  userId: string;
  fileId: string;
  validTime: number;
  code?: string;
}

export interface CreateShareData {
  userId: string;
  fileId: string;
  validTime: number;
  code?: string;
}
