import { PartialType } from '@nestjs/mapped-types';
import { CreateExcelDto } from './create-excel.dto';

export class UpdateExcelDto extends PartialType(CreateExcelDto) {
  id: number;
}
