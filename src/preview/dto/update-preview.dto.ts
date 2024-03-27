import { PartialType } from '@nestjs/swagger';
import { CreatePreviewDto } from './create-preview.dto';

export class UpdatePreviewDto extends PartialType(CreatePreviewDto) {}
