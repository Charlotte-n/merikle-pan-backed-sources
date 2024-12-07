import { Injectable } from '@nestjs/common';
import { MongodbPersistence } from 'y-mongodb-provider';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { setupWSConnection, setPersistence } = require('y-websocket/bin/utils');
import { Awareness } from 'y-protocols/awareness';
import { ConfigService } from '@nestjs/config';
import * as Y from 'yjs';

@Injectable()
export class YjsService {
  private mdb: MongodbPersistence;
  private docs: Map<string, { doc: Y.Doc; awareness: Awareness }> = new Map();

  constructor(private configService: ConfigService) {
    console.log(this.configService.get('MONGODB_URI'));
    this.mdb = new MongodbPersistence(this.configService.get('MONGODB_URI'), {
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
    console.log(docName);
    // 实现压缩逻辑
  }

  async compressAllDocuments() {
    // 实现所有文档压缩逻辑
  }
}
