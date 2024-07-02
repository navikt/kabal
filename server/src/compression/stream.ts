import zlib from 'node:zlib';

export enum CompressionType {
  GZIP,
  BROTLI,
  DEFLATE,
}

/**
 * Custom CompressionStream until Bun supports CompressionStream.
 * @link https://github.com/oven-sh/bun/issues/1723
 * */

export class CompressionStream {
  readable: ReadableStream;
  writable: WritableStream;

  constructor(public type: CompressionType = CompressionType.GZIP) {
    const handle = createCompress(type);

    this.readable = new ReadableStream({
      start(controller) {
        handle.on('data', (chunk: Uint8Array) => controller.enqueue(chunk));
        handle.once('end', () => controller.close());
      },
    });

    this.writable = new WritableStream({
      write: (chunk: Uint8Array) => {
        handle.write(chunk);
      },
      close: () => {
        handle.end();
      },
    });
  }
}

const createCompress = (type: CompressionType) => {
  switch (type) {
    case CompressionType.BROTLI:
      return zlib.createBrotliCompress();
    case CompressionType.GZIP:
      return zlib.createGzip();
    case CompressionType.DEFLATE:
      return zlib.createDeflate();
  }
};
