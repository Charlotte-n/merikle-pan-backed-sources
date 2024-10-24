import { PartialType } from '@nestjs/swagger';
import { CreateYjDto } from './create-yj.dto';

export class UpdateYjDto extends PartialType(CreateYjDto) {}
