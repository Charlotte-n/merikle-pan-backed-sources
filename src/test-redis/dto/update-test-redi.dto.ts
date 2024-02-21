import { PartialType } from '@nestjs/swagger';
import { CreateTestRediDto } from './create-test-redi.dto';

export class UpdateTestRediDto extends PartialType(CreateTestRediDto) {}
