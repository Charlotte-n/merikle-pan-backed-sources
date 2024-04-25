// yjs.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { InjectModel } from '@nestjs/mongoose';
import { Share } from '../../libs/db/models/share.model';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

@WebSocketGateway(1234, { cors: { origin: '*' } })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;

  // 保存 Yjs 文档的映射
  private ydocMap: Map<string, Y.Doc> = new Map();

  handleConnection(client: WebSocket, ...args: any[]) {
    console.log('Client connected:');
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('events')
  async handleMessage(@MessageBody() data: any) {
    console.log('我接受的信息为', data.delta, data.id);
    //将这个数据放入数据库里面
    try {
      const res = await this.ConFile.updateOne(
        {
          _id: data.id,
        },
        {
          content: data.delta.ops,
        },
      );
      console.log(res, '更新成功');
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // handleUpdateYjs(client: WebSocket, payload: any): void {
  //   const { roomName, update } = payload;
  //
  //   // 获取对应的 Yjs 文档
  //   const ydoc = this.ydocMap.get(roomName);
  //   if (ydoc) {
  //     Y.applyUpdate(ydoc, update);
  //
  //     // 广播更新给所有连接的客户端（除了发送者）
  //     this.server.clients.forEach((ws) => {
  //       if (ws !== client && ws.readyState === WebSocket.OPEN) {
  //         ws.send(
  //           JSON.stringify({
  //             type: 'yjsUpdate',
  //             roomName,
  //             update,
  //           }),
  //         );
  //       }
  //     });
  //   }
  // }
}
