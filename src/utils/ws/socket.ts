import getId from './getId';
import unzip from './unzip';
import { wshandle } from './eventHandler';

const getWID = () => Math.random().toString().split('.')[1].slice(0, 3);
const luckySheetSendMessage = (clients: any, client: any, fileId: any) => {
  //标记一下客户端的用户姓名和操作的文件id。
  const id = getWID();
  client.wid = id;
  client.fileId = fileId;
  client.wname = 'user_' + id;
  console.log(client.fileId, client.wid);
  try {
    client.on('message', (message: any) => {
      //在这里进行协同操作
      clients.forEach((conn) => {
        //实现了光标的更新
        if (conn.fileId !== client.fileId) return;
        if (conn.wid === client.wid) return;
        wshandle.call(
          conn,
          { id: client.wid, name: client.wname },
          unzip(message),
        );
      });
    });
  } catch (e) {
    console.log('出错了');
  }
};

export default luckySheetSendMessage;
