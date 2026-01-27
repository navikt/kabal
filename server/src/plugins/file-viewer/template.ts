import fs from 'node:fs';
import path from 'node:path';
import { getLogger } from '@app/logger';
import type { DocumentViewerMetadata } from '@app/plugins/file-viewer/types';
import type { FastifyReply } from 'fastify';

const log = getLogger('file-viewer');

const TEMPLATE_PATH = path.join(process.cwd(), '../file-viewer/dist/index.html');

const TEMPLATE = fs.existsSync(TEMPLATE_PATH) ? fs.readFileSync(TEMPLATE_PATH, { encoding: 'utf8' }) : null;

if (TEMPLATE === null) {
  log.warn({
    msg: 'File viewer template not found. File-viewer endpoints will return 503.',
    data: { path: TEMPLATE_PATH },
  });
}

const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const renderHtml = (
  reply: FastifyReply,
  title: string,
  metadata: DocumentViewerMetadata,
): ReturnType<FastifyReply['send']> => {
  if (TEMPLATE === null) {
    return reply.status(503).type('text/plain').send('File viewer is not available.');
  }

  const metadataJson = JSON.stringify(metadata);

  const html = TEMPLATE.replace('<title>Filvisning</title>', `<title>${escapeHtml(title)}</title>`).replace(
    '<script type="application/json" id="file-viewer-metadata"></script>',
    `<script type="application/json" id="file-viewer-metadata">${metadataJson}</script>`,
  );

  return reply.status(200).type('text/html').send(html);
};
