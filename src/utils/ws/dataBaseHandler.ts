// // 协同数据存储
// const { univerImpl, fileImpl } = require('../../mvc/serviceImpl');
// const { getNanoid } = require('../../util/nanoid');
//
// /**
//  * ... 更多操作请参考： [https://dream-num.github.io/LuckysheetDocs/zh/guide/operate.html#%E5%8D%95%E5%85%83%E6%A0%BC%E5%88%B7%E6%96%B0]
//  */
// let that = null;
//
// let wsfileid = '';
//
// // 定义操作映射
// const _vmap = {
//   v: () => v.call(that),
//   rv: () => rv.call(that),
//   cg: () => cg.call(that),
//   all: () => all.call(that),
//   fc: () => fc.call(that),
//   drc: () => drc.call(that),
//   sha: () => sha.call(that),
//   shc: () => shc.call(that),
//   shd: () => shd.call(that),
//   na: () => na.call(that),
// };
//
// export const dataBaseHandle = (opts, fileid) => (
//   (that = JSON.parse(opts)),
//   (wsfileid = fileid),
//   _vmap[that.t] && _vmap[that.t]()
// );
//
// // * v 单个单元格刷新
// async function v() {
//   console.log('v', this);
//
//   // 1. 需要识别当前操作是否为删除单元格内容
//   const { v, m, f } = this.v;
//   if (!v && !m && !f) return univerImpl.deleteCellDataImpl(this);
//
//   // 获取cdid
//   const cdid = await getNanoid();
//   // 2. 先获取行列信息 当前sheet的index值
//   const findRes = await univerImpl.findCellDataByRCImpl(this);
//
//   // 3. 判断当前行是否已经有数据
//   findRes.length
//     ? await univerImpl.updateCellDataImpl(this)
//     : // 3. 有则更新、没有则新增
//       await univerImpl.insertCellDataImpl(this, cdid);
//
//   // 4. 执行单元格历史记录【未开发】
// }
//
// // * rv 范围单元格刷新
// async function rv() {
//   console.log('rv', this);
// }
//
// // * cg config操作
// async function cg() {
//   // 识别边框
//   console.log('cg', this);
// }
//
// // * all 通用保存
// async function all() {
//   console.log('all', this);
//   /**
//    * 最好在这里识别 合并单元格操作，因为操作隶属config配置，可以直接去到 merge 的数值
//    * 如何区分是合并还是取消？
//    * 直接全量替换，先查询当前 i 下的所有 数据，进行差异比较，然后进行删除/保留操作
//    * merge:{0_0 : {r: 0, c: 0, rs: 3, cs: 3}}
//    */
//   const { i, v } = this;
//
//   const mergeList = [];
//
//   for (const key in v?.merge) {
//     if (Object.hasOwnProperty.call(v.merge, key)) {
//       const value = v.merge[key];
//       mergeList.push({ key, value });
//     }
//   }
//
//   // 1. 通过index 查询全部
//   const findAll = await univerImpl.findAllMergeConfigImpl(i);
//
//   const result = JSON.parse(JSON.stringify(findAll));
//
//   // 2. 进行数据对比，多了加、少了删、不一致更新
//   for (const merge of mergeList) {
//     const current = result.find((i) => i.key === merge.key);
//
//     // 如果没有，直接添加
//     if (!current) {
//       const cid = await getNanoid();
//       await univerImpl.createMergeConfigImpl(cid, i, merge);
//     } else {
//       // 有响应的 key 应该删除该key，这样才能知道那个是多余的，需要进行删除
//       result.splice(
//         result.findIndex((i) => i.key === merge.key),
//         1,
//       );
//       // {r: 0, c: 0, rs: 3, cs: 3}
//       // { r: 0, c: 0, rs: 3, cs: 3 }
//       const compare = compareMerge(JSON.parse(current.value), merge.value);
//       // 有，对比内容：一致 跳过
//       if (compare) continue;
//       // 有，对比内容：不一致 更新
//       await univerImpl.updateMergeConfigImpl(i, merge);
//     }
//   }
//
//   // 3. 有了则删除 result ，最后执行删除剩余result
//   console.log('deleteArr', result);
//   if (!result.length) return;
//
//   // 执行删除操作
//   result.forEach(async (d) => await univerImpl.deleteMergeConfigImpl(i, d.key));
// }
//
// // * fc 函数链操作
// async function fc() {
//   console.log('fc', this);
// }
//
// // * drc 删除行或列
// async function drc() {
//   console.log('drc', this);
// }
//
// // * sha 新建sheet
// async function sha() {
//   console.log('sha', this);
// }
//
// // * shc 复制sheet
// async function shc() {
//   console.log('shc', this);
// }
//
// // * shd 删除sheet
// async function shd() {
//   console.log('shd', this);
// }
//
// // * na 修改工作簿名称(其实就是 files 表的filename)
// async function na() {
//   // 通过 wsfileid 修改 filename 即可 fileid, vid, newfilename, newfolderid, state
//   await fileImpl.updateFilesImpl(wsfileid, null, this.v, null, null);
// }
//
// // 辅助函数 判断两个merge 是否一致
// function compareMerge(a, b) {
//   const r = a.r === b.r;
//   const c = a.c === b.c;
//   const rs = a.rs === b.rs;
//   const cs = a.cs === b.cs;
//   return r && c && rs && cs;
// }
