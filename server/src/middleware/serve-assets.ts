import { readdirSync } from 'node:fs';
import { MiddlewareHandler } from 'hono';
import { getMimeType } from 'hono/utils/mime';
import { getLogger } from '@app/logger';

const log = getLogger('serve-assets');

const ASSETS_FOLDER = '../frontend/dist/assets';

interface FileEntry {
  data: ArrayBuffer;
  mimeType: string;
}

const files: Map<string, FileEntry> = new Map();

readdirSync(ASSETS_FOLDER).forEach(async (fileName) => {
  const filePath = `${ASSETS_FOLDER}/${fileName}`;
  const file = Bun.file(filePath);

  if (await file.exists()) {
    const fileKey = `/assets/${fileName}`;
    const data = await file.arrayBuffer();
    const mimeType = getMimeType(filePath);

    if (mimeType === undefined) {
      log.warn({ msg: `Unknown MIME type for asset file "${fileName}"`, data: { path: filePath } });
    }

    files.set(fileKey, { data, mimeType: mimeType ?? 'text/plain' });
  }
});

export const serveStatic: MiddlewareHandler = async (context, next) => {
  // Do nothing if Response is already finalized.
  if (context.finalized) {
    await next();

    return;
  }

  const fileEntry = files.get(context.req.path);

  if (fileEntry === undefined) {
    log.warn({ msg: 'File not found', data: { path: context.req.path } });

    return context.text('Not Found', 404);
  }

  const { data, mimeType } = fileEntry;

  context.header('content-type', mimeType);

  return context.body(data, 200);
};
