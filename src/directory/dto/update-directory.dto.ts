import { PartialType } from '@nestjs/swagger';
import { CreateDirectoryDto } from './create-directory.dto';

export class UpdateDirectoryDto extends PartialType(CreateDirectoryDto) {}
