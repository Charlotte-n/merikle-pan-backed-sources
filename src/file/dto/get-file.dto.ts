export class GetFileListBody {
  pagation: { page: number; pageSize: number };
  fileType: number;
  fileId: string | number;
  title?: string;
  userId: string;
}
