// ali-oss.adapter.ts
import { StorageAdapter } from '../adaptor.interface';
import OSS from 'ali-oss';
import { STS } from 'ali-oss';

export class AliOSSAdapter implements StorageAdapter {
  private client: OSS;
  private config;

  constructor(config) {
    this.client = new OSS(config);
    this.config = config;
  }
  async getSignature(id: string) {
    const { accessKeyId, accessKeySecret, roleArn } = this.config;
    const sts = new STS({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
    });
    try {
      const result = await sts.assumeRole(roleArn, '', 3000, id);
      return {
        AccessKeyId: result.credentials.AccessKeyId,
        AccessKeySecret: result.credentials.AccessKeySecret,
        SecurityToken: result.credentials.SecurityToken,
      };
    } catch (err) {
      console.error(err);
    }
  }
}
