// yjs.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';
import { InjectModel } from '@nestjs/mongoose';
import { CommonFile } from '../../libs/db/models/commonFile.model';
import { Model } from 'mongoose';

@WebSocketGateway(1234, { cors: { origin: '*' } })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  @InjectModel(CommonFile.name)
  private readonly ConFile: Model<CommonFile>;

  handleConnection(client: WebSocket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: WebSocket) {
    console.log('Client disconnected:', client.id);
  }
}
