import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { getMimeType } from '@app/helpers/mime-type';
import { getLogger } from '@app/logger';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-assets');

const ASSETS_FOLDER = '../frontend/dist/assets';

interface FileEntry {
  data: Buffer;
  mimeType: string;
}

const FILE_ENTRY_MAP: Map<string, FileEntry> = new Map();

const files = readdirSync(ASSETS_FOLDER);

for (const fileName of files) {
  const filePath = `${ASSETS_FOLDER}/${fileName}`;

  if (existsSync(filePath)) {
    const fileKey = `/assets/${fileName}`;
    const data = readFileSync(filePath);

    FILE_ENTRY_MAP.set(fileKey, { data, mimeType: getMimeType(fileName) });
  }
}

export const SERVE_ASSETS_PLUGIN_ID = 'serve-assets';

export const serveAssetsPlugin = fastifyPlugin(
  async (app) => {
    app.get('/assets/*', async (req, res) => {
      const fileEntry = FILE_ENTRY_MAP.get(req.url);

      if (fileEntry === undefined) {
        log.warn({ msg: 'File not found', data: { path: req.url } });
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
  { fastify: '5', name: SERVE_ASSETS_PLUGIN_ID },
);
