import { ApiClientEnum } from '@app/config/config';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Value } from 'typebox/value';

const log = getLogger('document-set');

const METADATA_BASE_URL = KABAL_API_URL;

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

// TODO: Add variants to the archived document response when the API supports it.
const ARCHIVED_RESPONSE = Type.Object({
  documents: Type.Array(ArchivedApiDocumentSchema),
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

const DuaDocumentSchema = Type.Object({
  id: Type.String(),
  tittel: Type.String(),
});

const DUA_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});

const DUA_RESPONSE = Type.Object({
  documents: Type.Array(DuaDocumentSchema),
});

// --- Vedleggsoversikt schemas ---

const VEDLEGGSOVERSIKT_PARAMS = Type.Object({
  behandlingId: Type.String({ format: 'uuid' }),
  id: Type.String({ format: 'uuid' }),
});

const VedleggsoversiktDocumentSchema = Type.Object({
  id: Type.String(),
  tittel: Type.Literal('Vedleggsoversikt'),
});

const VEDLEGGSOVERSIKT_RESPONSE = Type.Object({
  documents: Type.Array(VedleggsoversiktDocumentSchema),
});

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
            produces: ['application/json'],
            response: { 200: ARCHIVED_RESPONSE },
          },
        },
        async (req, reply) => {
          const references = decodeArchivedDocumentIds(req.params.ids);

          if (references.length === 0) {
            return reply.status(200).send({ documents: [] });
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

          const documents = metadataResults.filter(
            (metadata): metadata is IArchivedApiDocument => metadata?.hasAccess === true,
          );

          return reply.status(200).send({ documents });
        },
      )

      // 2. Document in progress (DUA)
      .get(
        '/document-set/dua/:behandlingId/:id',
        {
          schema: {
            tags: ['dokumenter'],
            params: DUA_PARAMS,
            produces: ['application/json'],
            response: {
              200: DUA_RESPONSE,
              404: Type.Object({ error: Type.String() }),
            },
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

              return reply.status(404).send({ error: 'Failed to fetch documents in progress' });
            }

            const json: unknown = await response.json();

            if (!Array.isArray(json) || !json.every((item) => Value.Check(DuaApiDocumentSchema, item))) {
              log.warn({
                msg: 'Invalid documents in progress response',
                data: { behandlingId, id },
              });

              return reply.status(404).send({ error: 'Invalid documents in progress response' });
            }

            const allDocuments = json as IDuaApiDocument[];

            const document = allDocuments.find((doc) => doc.id === id);

            if (document === undefined) {
              return reply.status(404).send({ error: 'Document not found' });
            }

            // If the document is a parent (no parentId), include it and all its attachments.
            // If the document is an attachment, include only that document.
            const isParent = document.parentId === null;

            const documents = isParent ? [document, ...allDocuments.filter((doc) => doc.parentId === id)] : [document];

            return reply.status(200).send({
              documents: documents.map(({ id, tittel }) => ({ id, tittel })),
            });
          } catch (error) {
            log.warn({
              msg: 'Error fetching documents in progress',
              data: { behandlingId, id, error: String(error) },
            });

            return reply.status(404).send({ error: 'Error fetching documents in progress' });
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
            produces: ['application/json'],
            response: { 200: VEDLEGGSOVERSIKT_RESPONSE },
          },
        },
        async (req, reply) =>
          reply.status(200).send({ documents: [{ id: req.params.id, tittel: 'Vedleggsoversikt' as const }] }),
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
