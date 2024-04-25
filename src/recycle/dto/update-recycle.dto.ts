import { PartialType } from '@nestjs/swagger';
import { CreateRecycleDto } from './create-recycle.dto';

export class UpdateRecycleDto extends PartialType(CreateRecycleDto) {}
