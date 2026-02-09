import fs from 'node:fs';
import path from 'node:path';
import { ApiClientEnum } from '@app/config/config';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Value } from 'typebox/value';

const log = getLogger('document-set');

const METADATA_BASE_URL = KABAL_API_URL;

// --- Document viewer template ---

const TEMPLATE_PATH = path.join(process.cwd(), '../document-viewer/dist/index.html');

const TEMPLATE = fs.existsSync(TEMPLATE_PATH)
  ? fs.readFileSync(TEMPLATE_PATH, { encoding: 'utf8' })
  : null;

if (TEMPLATE === null) {
  log.warn({ msg: 'Document viewer template not found. Document-set endpoints will return 503.', data: { path: TEMPLATE_PATH } });
}

// --- Embedded metadata types ---

interface DocumentViewerMetadata {
  navIdent: string;
  documents: Array<{
    title: string;
    url: string;
  }>;
}

// --- Archived document schemas ---

/** Schema for validating the kabal-api response. */
const ArchivedApiDocumentSchema = Type.Object({
  journalpostId: Type.String(),
  dokumentInfoId: Type.String(),
  title: Type.String(),
  harTilgangTilArkivvariant: Type.Boolean(),
  hasAccess: Type.Boolean(),
});

interface IArchivedApiDocument {
  journalpostId: string;
  dokumentInfoId: string;
  title: string;
  harTilgangTilArkivvariant: boolean;
  hasAccess: boolean;
}

const ARCHIVED_PARAMS = Type.Object({
  ids: Type.String({ description: 'Encoded archived document IDs' }),
});

// --- DUA document schemas ---

const DuaApiDocumentSchema = Type.Object({
  id: Type.String(),
  tittel: Type.String(),
  parentId: Type.Union([Type.String(), Type.Null()]),
});

interface IDuaApiDocument {
  id: string;
  tittel: string;
  parentId: string | null;
}

const DUA_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});

// --- Vedleggsoversikt schemas ---

const VEDLEGGSOVERSIKT_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});

// --- HTML rendering ---

const renderHtml = (reply: FastifyReply, title: string, metadata: DocumentViewerMetadata): ReturnType<FastifyReply['send']> => {
  if (TEMPLATE === null) {
    return reply.status(503).type('text/plain').send('Document viewer is not available.');
  }

  const metadataJson = JSON.stringify(metadata);

  const html = TEMPLATE
    .replace('<title>Dokumentvisning</title>', `<title>${escapeHtml(title)}</title>`)
    .replace(
      '<script type="application/json" id="document-viewer-metadata"></script>',
      `<script type="application/json" id="document-viewer-metadata">${metadataJson}</script>`,
    );

  return reply.status(200).type('text/html').send(html);
};

const escapeHtml = (text: string): string =>
  text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// --- PDF URL helpers ---

const getArchivedPdfUrl = (journalpostId: string, dokumentInfoId: string): string =>
  `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf`;

const getDuaPdfUrl = (behandlingId: string, documentId: string): string =>
  `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf`;

const getVedleggsoversiktPdfUrl = (behandlingId: string, documentId: string): string =>
  `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf`;

// --- Plugin ---

export const documentSetPlugin = fastifyPlugin(
  async (app) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()

      // 1. Archived documents
      .get(
        '/document-set/archived/:ids',
        {
          schema: {
            tags: ['dokumenter'],
            params: ARCHIVED_PARAMS,
            produces: ['text/html'],
          },
        },
        async (req, reply) => {
          const references = decodeArchivedDocumentIds(req.params.ids);

          if (references.length === 0) {
            return renderHtml(reply, 'Ingen dokumenter', {
              navIdent: req.navIdent,
              documents: [],
            });
          }

          const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API, reply);
          const headers = getProxyRequestHeaders(req, ApiClientEnum.KABAL_API, oboAccessToken);

          const metadataStart = performance.now();

          const metadataResults = await Promise.all(
            references.map(async ({ journalpostId, dokumentInfoId }) => {
              const url = `${METADATA_BASE_URL}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}`;

              try {
                const response = await fetch(url, { method: 'GET', headers });

                if (!response.ok) {
                  log.warn({
                    msg: 'Failed to fetch archived document metadata',
                    data: { status: response.status, journalpostId, dokumentInfoId },
                  });

                  return null;
                }

                const json: unknown = await response.json();

                if (!Value.Check(ArchivedApiDocumentSchema, json)) {
                  log.warn({
                    msg: 'Invalid archived metadata response',
                    data: { journalpostId, dokumentInfoId },
                  });

                  return null;
                }

                return json;
              } catch (error) {
                log.warn({
                  msg: 'Error fetching archived document metadata',
                  data: { journalpostId, dokumentInfoId, error: String(error) },
                });

                return null;
              }
            }),
          );

          reply.addServerTiming('metadata_request_time', getDuration(metadataStart), 'Metadata Request Time');

          const accessibleDocuments = metadataResults.filter(
            (metadata): metadata is IArchivedApiDocument => metadata?.hasAccess === true,
          );

          const documents = accessibleDocuments.map((doc) => ({
            title: doc.title,
            url: getArchivedPdfUrl(doc.journalpostId, doc.dokumentInfoId),
          }));

          const pageTitle = documents[0]?.title ?? 'Dokumentvisning';

          return renderHtml(reply, pageTitle, {
            navIdent: req.navIdent,
            documents,
          });
        },
      )

      // 2. Document in progress (DUA)
      .get(
        '/document-set/dua/:behandlingId/:id',
        {
          schema: {
            tags: ['dokumenter'],
            params: DUA_PARAMS,
            produces: ['text/html'],
          },
        },
        async (req, reply) => {
          const { behandlingId, id } = req.params;

          const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API, reply);
          const headers = getProxyRequestHeaders(req, ApiClientEnum.KABAL_API, oboAccessToken);

          const start = performance.now();

          const url = `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter`;

          try {
            const response = await fetch(url, { method: 'GET', headers });

            reply.addServerTiming('dua_request_time', getDuration(start), 'DUA Request Time');

            if (!response.ok) {
              log.warn({
                msg: 'Failed to fetch documents in progress',
                data: { status: response.status, behandlingId, id },
              });

              return reply.status(404).type('text/plain').send('Failed to fetch documents in progress');
            }

            const json: unknown = await response.json();

            if (!Array.isArray(json) || !json.every((item) => Value.Check(DuaApiDocumentSchema, item))) {
              log.warn({
                msg: 'Invalid documents in progress response',
                data: { behandlingId, id },
              });

              return reply.status(404).type('text/plain').send('Invalid documents in progress response');
            }

            const allDocuments = json as IDuaApiDocument[];

            const document = allDocuments.find((doc) => doc.id === id);

            if (document === undefined) {
              return reply.status(404).type('text/plain').send('Document not found');
            }

            // If the document is a parent (no parentId), include it and all its attachments.
            // If the document is an attachment, include only that document.
            const isParent = document.parentId === null;

            const matchedDocuments = isParent
              ? [document, ...allDocuments.filter((doc) => doc.parentId === id)]
              : [document];

            const documents = matchedDocuments.map(({ id: docId, tittel }) => ({
              title: tittel,
              url: getDuaPdfUrl(behandlingId, docId),
            }));

            const pageTitle = documents[0]?.title ?? 'Dokumentvisning';

            return renderHtml(reply, pageTitle, {
              navIdent: req.navIdent,
              documents,
            });
          } catch (error) {
            log.warn({
              msg: 'Error fetching documents in progress',
              data: { behandlingId, id, error: String(error) },
            });

            return reply.status(404).type('text/plain').send('Error fetching documents in progress');
          }
        },
      )

      // 3. Attachment overview (vedleggsoversikt)
      .get(
        '/document-set/dua/:behandlingId/:id/vedleggsoversikt',
        {
          schema: {
            tags: ['dokumenter'],
            params: VEDLEGGSOVERSIKT_PARAMS,
            produces: ['text/html'],
          },
        },
        async (req, reply) => {
          const { behandlingId, id } = req.params;

          const documents = [
            {
              title: 'Vedleggsoversikt',
              url: getVedleggsoversiktPdfUrl(behandlingId, id),
            },
          ];

          return renderHtml(reply, 'Vedleggsoversikt', {
            navIdent: req.navIdent,
            documents,
          });
        },
      );
  },
  { fastify: '5', name: 'document-set', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);

// --- Archived document ID encoding/decoding ---

interface IJournalfoertDokumentId {
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

/** Separator between journalpost groups. */
const GROUP_SEPARATOR = ';';
/** Separator between a journalpostId and its dokumentInfoIds. */
const KEY_SEPARATOR = ':';
/** Separator between dokumentInfoIds within a single journalpost group. */
const VALUE_SEPARATOR = ',';

/**
 * Decodes a compact path segment back into an array of archived document references.
 *
 * @see encodeArchivedDocumentIds for the encoding format.
 */
export const decodeArchivedDocumentIds = (encoded: string): IJournalfoertDokumentId[] => {
  if (encoded.length === 0) {
    return [];
  }

  const groups = encoded.split(GROUP_SEPARATOR);
  const result: IJournalfoertDokumentId[] = [];

  for (const group of groups) {
    const separatorIndex = group.indexOf(KEY_SEPARATOR);

    if (separatorIndex === -1) {
      continue;
    }

    const journalpostId = group.slice(0, separatorIndex);
    const dokumentInfoIds = group.slice(separatorIndex + 1).split(VALUE_SEPARATOR);

    for (const dokumentInfoId of dokumentInfoIds) {
      if (dokumentInfoId.length > 0) {
        result.push({ journalpostId, dokumentInfoId });
      }
    }
  }

  return result;
};
