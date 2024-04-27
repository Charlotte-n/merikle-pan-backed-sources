import pako from 'pako';

const unzip = (message: any) => {
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
  return result;
};

export default unzip;
