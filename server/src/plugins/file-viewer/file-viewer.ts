import { ApiClientEnum } from '@app/config/config';
import { isNotNull } from '@app/functions/guards';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { decodeArchivedDocumentIds, normalizeVariants } from '@app/plugins/file-viewer/encoding';
import {
  ARCHIVED_PARAMS,
  type ArchivedApiDocument,
  ArchivedApiDocumentSchema,
  DUA_PARAMS,
  DuaApiDocumentSchema,
  type IDuaApiDocument,
  VEDLEGGSOVERSIKT_PARAMS,
} from '@app/plugins/file-viewer/schemas';
import { renderHtml } from '@app/plugins/file-viewer/template';
import type { FileEntry } from '@app/plugins/file-viewer/types';
import { getArchivedPdfUrl, getDuaPdfUrl, getVedleggsoversiktPdfUrl } from '@app/plugins/file-viewer/urls';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Value } from 'typebox/value';

const log = getLogger('file-viewer');

const METADATA_BASE_URL = KABAL_API_URL;

export const fileViewerPlugin = fastifyPlugin(
  async (app) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()

      // Archived documents
      .get(
        '/file-viewer/archived/:ids',
        {
          schema: {
            tags: ['file-viewer'],
            params: ARCHIVED_PARAMS,
            produces: ['text/html'],
          },
        },
        async (req, reply) => {
          const references = decodeArchivedDocumentIds(req.params.ids);

          if (references.length === 0) {
            return renderHtml(reply, 'Ingen dokumenter', {
              navIdent: req.navIdent,
              files: [],
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

                return json as ArchivedApiDocument;
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

          const files: FileEntry[] = metadataResults.filter(isNotNull).map<FileEntry>((doc) => {
            const fileUrl = getArchivedPdfUrl(doc.journalpostId, doc.dokumentInfoId);

            return {
              title: doc.title,
              url: fileUrl,
              downloadUrl: fileUrl,
              variants: normalizeVariants(doc.varianter),
            } satisfies FileEntry;
          });

          const pageTitle = files[0]?.title ?? 'Dokumentvisning';

          return renderHtml(reply, pageTitle, {
            navIdent: req.navIdent,
            files,
          });
        },
      )

      // Document in progress (DUA)
      .get(
        '/file-viewer/dua/:behandlingId/:id',
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

            const files: FileEntry[] = matchedDocuments.map(({ id: docId, tittel }) => ({
              title: tittel,
              url: getDuaPdfUrl(behandlingId, docId),
              variants: 'PDF',
            }));

            const pageTitle = files[0]?.title ?? 'Dokumentvisning';

            return renderHtml(reply, pageTitle, {
              navIdent: req.navIdent,
              files,
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

      // Attachment overview (vedleggsoversikt)
      .get(
        '/file-viewer/dua/:behandlingId/:id/vedleggsoversikt',
        {
          schema: {
            tags: ['dokumenter'],
            params: VEDLEGGSOVERSIKT_PARAMS,
            produces: ['text/html'],
          },
        },
        async (req, reply) => {
          const { behandlingId, id } = req.params;

          return renderHtml(reply, 'Vedleggsoversikt', {
            navIdent: req.navIdent,
            files: [
              {
                title: 'Vedleggsoversikt',
                url: getVedleggsoversiktPdfUrl(behandlingId, id),
                variants: 'PDF',
              },
            ],
          });
        },
      );
  },
  { fastify: '5', name: 'file-viewer', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);
