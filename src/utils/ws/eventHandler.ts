import dayjs from 'dayjs';
function callbackdata(user, data, type) {
  console.log(data, '获取的数据为');
  /**
   * createTime: 命令发送时间
   * data:{} 修改的命令
   * id: "7a"   websocket的id
   * returnMessage: "success"
   * status: "0"  0告诉前端需要根据data的命令修改  1无意义
   * type: 0：连接成功，1：发送给当前连接的用户，2：发送信息给其他用户，3：发送选区位置信息，999：用户连接断开
   * username: 用户名
   *
   * 源码中的数据解释：
   */

  return JSON.stringify({
    createTime: dayjs().format('YYYYMMHH mm:hh:ss'),
    data,
    id: user.id,
    returnMessage: 'success',
    status: 0,
    type,
    username: user.name,
  });
}

/**
 * ws 事件响应中心
 *  根据不同的事件，返回不同的数据
 *  type 1 成功/失败
 *  type 2 更新数据
 *  type 3 用户光标
 *  type 4 批量处理数据
 */
//来处理光标和发送给用户消息的
export function wshandle(user, data) {
  // 表示用户移动鼠标 实际是需要根据指令实现不同的响应的，但是这里统一做 更新数据
  this.send(callbackdata(user, data, JSON.parse(data).t === 'mv' ? 3 : 2));
}
