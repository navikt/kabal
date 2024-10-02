import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { getLogger } from '@app/logger';
import { getMimeType } from '@app/helpers/mime-type';
import fastifyPlugin from 'fastify-plugin';

const log = getLogger('serve-assets');

const ASSETS_FOLDER = '../frontend/dist/assets';

interface FileEntry {
  data: Buffer;
  mimeType: string;
}

const files: Map<string, FileEntry> = new Map();

readdirSync(ASSETS_FOLDER).forEach(async (fileName) => {
  const filePath = `${ASSETS_FOLDER}/${fileName}`;

  if (existsSync(filePath)) {
    const fileKey = `/assets/${fileName}`;
    const data = readFileSync(filePath);

    files.set(fileKey, { data, mimeType: getMimeType(fileName) });
  }
});

export const SERVE_ASSETS_PLUGIN_ID = 'serve-assets';

export const serveAssetsPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app.get('/assets/*', async (req, res) => {
      const fileEntry = files.get(req.url);

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

    pluginDone();
  },
  { fastify: '5', name: SERVE_ASSETS_PLUGIN_ID },
);
