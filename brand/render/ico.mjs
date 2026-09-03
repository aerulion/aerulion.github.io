import {readFileSync, writeFileSync} from 'node:fs';

const out = process.argv[2];
const sources = process.argv.slice(3);

const pngs = sources.map((file) => {
    const data = readFileSync(file);
    if (data.readUInt32BE(12) !== 0x49484452) throw new Error(`${file}: not a PNG`);
    return {data, width: data.readUInt32BE(16), height: data.readUInt32BE(20)};
});

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);

let offset = 6 + pngs.length * 16;
const entries = pngs.map(({data, width, height}) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(width >= 256 ? 0 : width, 0);
    e.writeUInt8(height >= 256 ? 0 : height, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    return e;
});

writeFileSync(out, Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]));
console.log(`${out}  ${pngs.map((p) => p.width).join('/')}  ${offset} bytes`);
