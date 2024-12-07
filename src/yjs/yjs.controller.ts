import { Controller } from '@nestjs/common';
import { YjsService } from './yjs.service';

@Controller('yjs')
export class YjsController {
  constructor(private readonly yjsService: YjsService) {}
}
