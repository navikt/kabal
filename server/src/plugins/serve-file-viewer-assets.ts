import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { getMimeType } from '@app/helpers/mime-type';
import { getLogger } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-file-viewer-assets');

const ASSETS_FOLDER = '../file-viewer/dist/assets';

interface FileEntry {
  data: Buffer;
  mimeType: string;
}

const FILE_ENTRY_MAP: Map<string, FileEntry> = new Map();

if (existsSync(ASSETS_FOLDER)) {
  const files = readdirSync(ASSETS_FOLDER);

  for (const fileName of files) {
    const filePath = path.join(ASSETS_FOLDER, fileName);

    if (existsSync(filePath)) {
      const fileKey = `/file-viewer/assets/${fileName}`;
      const data = readFileSync(filePath);

      FILE_ENTRY_MAP.set(fileKey, { data, mimeType: getMimeType(fileName) });
    }
  }

  log.info({ msg: `Loaded ${FILE_ENTRY_MAP.size.toString(10)} file-viewer asset(s)` });
} else {
  log.warn({ msg: 'File-viewer assets folder not found', data: { path: ASSETS_FOLDER } });
}

export const SERVE_DOCUMENT_VIEWER_ASSETS_PLUGIN_ID = 'serve-file-viewer-assets';

export const serveDocumentViewerAssetsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/file-viewer/assets/*', async (req, res) => {
      const fileEntry = FILE_ENTRY_MAP.get(req.url);

      if (fileEntry === undefined) {
        log.warn({ msg: 'Document-viewer asset not found', data: { path: req.url } });
        res.header('content-type', 'text/plain');
        res.status(404);

        return res.send('Not Found');
      }

      const { data, mimeType } = fileEntry;

      res.header('content-type', mimeType);
      res.status(200);

      return res.send(data);
    });
  },
  { fastify: '5', name: SERVE_DOCUMENT_VIEWER_ASSETS_PLUGIN_ID },
);
