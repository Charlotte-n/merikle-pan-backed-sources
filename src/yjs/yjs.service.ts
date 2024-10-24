import { Injectable } from '@nestjs/common';
import { CreateYjDto } from './dto/create-yj.dto';
import { UpdateYjDto } from './dto/update-yj.dto';
import { MongodbPersistence } from 'y-mongodb-provider';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setupWSConnection, setPersistence } = require('y-websocket/bin/utils');
import { Awareness } from 'y-protocols/awareness';
import * as Y from 'yjs';

@Injectable()
export class YjsService {
  private mdb: MongodbPersistence;
  private docs: Map<string, { doc: Y.Doc; awareness: Awareness }> = new Map();

  constructor() {
    this.mdb = new MongodbPersistence('mongodb://127.0.0.1:27017/pan', {
      flushSize: 1000,
      multipleCollections: false,
    });

    setPersistence({
      bindState: async (docName, ydoc) => {
        const persistedYdoc = await this.mdb.getYDoc(docName);
        const newUpdates = Y.encodeStateAsUpdate(ydoc);
        this.mdb.storeUpdate(docName, newUpdates);
        Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
        ydoc.on('update', async (update) => {
          this.mdb.storeUpdate(docName, update);
        });
      },
      writeState: () => Promise.resolve(true),
    });
  }
  //连接ws
  setupWSConnection(conn: WebSocket, req: any, options: any) {
    const docName = options.docName;
    console.log(docName);

    if (!this.docs.get(docName)) {
      const doc = new Y.Doc();
      const awareness = new Awareness(doc);
      this.docs.set(docName, { doc, awareness });
    }

    const { doc, awareness } = this.docs.get(docName);
    setupWSConnection(conn, req, { ...options, doc, awareness });
  }

  async compressDocumentUpdates(docName: string) {
    // 实现压缩逻辑
  }

  async compressAllDocuments() {
    // 实现所有文档压缩逻辑
  }

  create(createYjDto: CreateYjDto) {
    return 'This action adds a new yj';
  }

  findAll() {
    return `This action returns all yjs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} yj`;
  }

  update(id: number, updateYjDto: UpdateYjDto) {
    return `This action updates a #${id} yj`;
  }

  remove(id: number) {
    return `This action removes a #${id} yj`;
  }
}
