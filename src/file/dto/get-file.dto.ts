export class GetFileListBody {
  pagation: { page: number; pageSize: number };
  fileType: number;
  fileId: string;
  title?: string;
  userId: string;
}
