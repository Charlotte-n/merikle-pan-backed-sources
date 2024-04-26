import { PartialType } from '@nestjs/swagger';
import { CreateCommonExcelDto } from './create-common-excel.dto';

export class UpdateCommonExcelDto extends PartialType(CreateCommonExcelDto) {}
