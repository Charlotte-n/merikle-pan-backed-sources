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
import { Server, WebSocket } from 'ws';
import { HttpException, HttpStatus } from '@nestjs/common';
import unzip from '../utils/ws/unzip';
import getId from '../utils/ws/getId';
import luckySheetSendMessage from '../utils/ws/socket';

// 在初始化 WebSocket 服务器时创建一个集合来存储连接
const clients = [];

// 添加新的连接到集合中
function addClient(client) {
  clients.push(client);
}

// 从集合中移除连接
// function removeClient(client) {
//   clients.(client);
// }

@WebSocketGateway(2555, { cors: '*', messageEventHandler: true })
export class WebsocketExcelGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;
  async handleConnection(client: WebSocket, ...args) {
    const fileId = getId(args);
    addClient(client);
    const res = [];
    luckySheetSendMessage(clients, client, fileId);
    client.on('message', async (message) => {
      const result = unzip(message);
      console.log(result, '获取的结果值');
      //进行映射
      if (JSON.parse(result).t === 'v') {
        res.push(result);
      }
      try {
        await this.ConFile.updateOne(
          {
            _id: fileId,
          },
          {
            content: res,
          },
        );
      } catch (e) {
        console.log(e);
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
