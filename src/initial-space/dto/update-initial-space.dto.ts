import { PartialType } from '@nestjs/swagger';
import { CreateInitialSpaceDto } from './create-initial-space.dto';

export class UpdateInitialSpaceDto extends PartialType(CreateInitialSpaceDto) {}
