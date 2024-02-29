import { Injectable } from '@nestjs/common';

@Injectable()
export class PagationService {
  async pagation(model: any, page: number, pageSize) {
    try {
      const result = await model
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize);
      return result;
    } catch (error) {
      console.error('Error during pagination:', error);
      return {
        message: error,
        code: 1,
      };
    }
  }
}
