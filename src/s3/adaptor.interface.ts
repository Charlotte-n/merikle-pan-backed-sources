export interface StorageAdapter {
  getSignature: (id: string) => Promise<any>;
  simpleUpload?: (key: string, filePath: string) => Promise<any>;
  chunkUpload?: (bucket: string, key: string) => Promise<any>;
  mergeUpload?: (bucket: string, key: string) => Promise<any>;
  listFiles?: () => Promise<any>;
}
