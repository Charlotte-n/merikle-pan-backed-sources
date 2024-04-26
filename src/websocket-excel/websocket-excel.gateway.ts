import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { InjectModel } from '@nestjs/mongoose';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { Model } from 'mongoose';
import pako from 'pako';
import { Server, WebSocket } from 'ws';
import * as url from 'url';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway(2555, { cors: '*', messageEventHandler: true })
export class WebsocketExcelGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;
  async handleConnection(client: WebSocket, ...args) {
    const idRegex = /id=([^&]+)/;
    const match = args[0].url.match(idRegex);
    const id = match ? match[1] : null;
    // 添加对消息的处理逻辑
    client.on('message', (message) => {
      //对数据进行解压
      const msg = message
        .toString()
        .split('')
        .map((i) => i.charCodeAt(0));
      const binData = new Uint8Array(msg);
      const data = pako.inflate(binData);
      const result = decodeURIComponent(
        String.fromCharCode.apply(null, new Uint16Array(data)),
      );
      try {
        this.ConFile.updateOne(
          {
            _id: id,
          },
          {
            content: result,
          },
        );
        return {
          code: 0,
          msg: '更新成功',
        };
      } catch (e) {
        throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client.id);
  }

  handleMessage(@MessageBody() data: any): string {
    console.log('接收到了信息了', data);
    return 'Hello world!';
  }
}
