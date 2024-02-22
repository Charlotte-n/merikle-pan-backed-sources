import { PartialType } from '@nestjs/swagger';
import { CreateLoginRegisterDto } from './create-login-register.dto';

export class UpdateLoginRegisterDto extends PartialType(CreateLoginRegisterDto) {}
