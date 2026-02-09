import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { getMimeType } from '@app/helpers/mime-type';
import { getLogger } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-document-viewer-assets');

const ASSETS_FOLDER = '../document-viewer/dist/assets';

interface FileEntry {
  data: Buffer;
  mimeType: string;
}

const FILE_ENTRY_MAP: Map<string, FileEntry> = new Map();

if (existsSync(ASSETS_FOLDER)) {
  const files = readdirSync(ASSETS_FOLDER);

  for (const fileName of files) {
    const filePath = `${ASSETS_FOLDER}/${fileName}`;

    if (existsSync(filePath)) {
      const fileKey = `/document-viewer/assets/${fileName}`;
      const data = readFileSync(filePath);

      FILE_ENTRY_MAP.set(fileKey, { data, mimeType: getMimeType(fileName) });
    }
  }

  log.info({ msg: `Loaded ${FILE_ENTRY_MAP.size.toString(10)} document-viewer asset(s)` });
} else {
  log.warn({ msg: 'Document-viewer assets folder not found', data: { path: ASSETS_FOLDER } });
}

export const SERVE_DOCUMENT_VIEWER_ASSETS_PLUGIN_ID = 'serve-document-viewer-assets';

export const serveDocumentViewerAssetsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/document-viewer/assets/*', async (req, res) => {
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
