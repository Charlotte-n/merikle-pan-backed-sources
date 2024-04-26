import { Injectable } from '@nestjs/common';
import { CreateCommonExcelDto } from './dto/create-common-excel.dto';
import { UpdateCommonExcelDto } from './dto/update-common-excel.dto';
import { InjectModel } from '@nestjs/mongoose';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { Model } from 'mongoose';

@Injectable()
export class CommonExcelService {
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;
  async fetchExcelData(body: any) {
    const sheetData = [
      //status为1的sheet页，重点是需要提供初始化的数据celldata
      {
        name: 'Cell',
        index: 'sheet_01',
        order: 0,
        status: 1,
        celldata: [
          { r: 0, c: 0, v: { v: 1, m: '1', ct: { fa: 'General', t: 'n' } } },
        ],
      },
      //其他status为0的sheet页，无需提供celldata，只需要配置项即可
      {
        name: 'Data',
        index: 'sheet_02',
        order: 1,
        status: 0,
      },
      {
        name: 'Picture',
        index: 'sheet_03',
        order: 2,
        status: 0,
      },
    ];
    return {
      code: 0,
      data: JSON.stringify(sheetData),
    };
  }
}
