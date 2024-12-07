// storage.service.ts
import { Injectable } from '@nestjs/common';
import { StorageAdapter } from './adaptor.interface';

@Injectable()
export class StorageService {
  constructor(private adapter: StorageAdapter) {
    this.adapter = adapter;
  }
  async getSignature(id: string) {
    return await this.adapter.getSignature(id);
  }

  async simpleUpload(path: string, filePath: string): Promise<any> {
    return this.adapter.simpleUpload(path, filePath);
  }

  async listFiles() {
    return this.adapter.listFiles();
  }
  async chunkUpload(path: string, filePath: string): Promise<any> {
    return this.adapter.chunkUpload(path, filePath);
  }

  async mergeUpload(bucket: string, key: string): Promise<any> {
    return this.adapter.mergeUpload(bucket, key);
  }
}
