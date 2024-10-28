import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { ExcelService } from './excel.service';

@WebSocketGateway(3005)
export class ExcelGateway {
  constructor(private readonly excelService: ExcelService) {}

  @SubscribeMessage('findOneExcel')
  findOne(@MessageBody() id: number) {
    return this.excelService.findOne(id);
  }
}
