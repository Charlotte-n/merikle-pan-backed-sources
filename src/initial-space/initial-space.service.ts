import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInitialSpaceDto } from './dto/create-initial-space.dto';
import { UpdateInitialSpaceDto } from './dto/update-initial-space.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InitialSpace } from './entities/initial-space.entity';

@Injectable()
export class InitialSpaceService {
  @InjectModel(InitialSpace.name)
  private InitialSpace: Model<InitialSpace>;
  create(createInitialSpaceDto: CreateInitialSpaceDto) {
    return 'This action adds a new initialSpace';
  }

  /**
   * 更新初始化空间
   * @param body
   */
  async updateInitialSpace(body: any) {
    const { space } = body;
    try {
      const res = await this.InitialSpace.updateOne(
        {
          delete: 0,
        },
        {
          totalSpace: space,
        },
      );
      if (res) {
        return {
          code: 0,
          msg: '更新成功',
        };
      } else {
        await this.InitialSpace.create({
          totalSpace: space,
          delete: 0,
        });
        return {
          code: 0,
          msg: '创建成功',
        };
      }
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
