import { PartialType } from '@nestjs/swagger';
import { CreateEmailSendDto } from './create-email-send.dto';

export class UpdateEmailSendDto extends PartialType(CreateEmailSendDto) {}
