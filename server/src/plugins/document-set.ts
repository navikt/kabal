import { randomUUID } from 'node:crypto';
import { ApiClientEnum } from '@app/config/config';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { KABAL_API_URL } from '@app/plugins/crdt/api/url';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { getValkeyClient } from '@app/valkey/valkey-client';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyPlugin from 'fastify-plugin';
import { Value } from 'typebox/value';

interface IArchivedReference {
  journalpostId: string;
  dokumentInfoId: string;
}

interface IArchivedDocumentMetadata extends IArchivedReference {
  title: string;
  harTilgangTilArkivvariant: boolean;
  hasAccess: boolean;
}

const log = getLogger('document-set');

const DOCUMENT_SET_PREFIX = 'document-set';
const DOCUMENT_SET_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 days

const METADATA_BASE_URL = KABAL_API_URL;

const ArchivedReferenceSchema = Type.Object({
  journalpostId: Type.String(),
  dokumentInfoId: Type.String(),
});

const ArchivedDocumentMetadataSchema = Type.Object({
  journalpostId: Type.String(),
  dokumentInfoId: Type.String(),
  title: Type.String(),
  harTilgangTilArkivvariant: Type.Boolean(),
  hasAccess: Type.Boolean(),
});

const DOCUMENT_SET_BODY = Type.Object({
  documents: Type.Array(ArchivedReferenceSchema),
});

const DOCUMENT_SET_RESPONSE = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

const DOCUMENT_SET_PARAMS = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

const DOCUMENT_SET_GET_RESPONSE = Type.Object({
  documents: Type.Array(ArchivedDocumentMetadataSchema),
});

export const documentSetPlugin = fastifyPlugin(
  async (app) => {
    const valkeyClient = await getValkeyClient();

    app
      .withTypeProvider<TypeBoxTypeProvider>()

      .post(
        '/document-set',
        {
          schema: {
            tags: ['dokumenter'],
            body: DOCUMENT_SET_BODY,
            produces: ['application/json'],
            response: { 200: DOCUMENT_SET_RESPONSE },
          },
        },
        async (req, reply) => {
          const { documents } = req.body;
          const id = randomUUID();
          const key = `${DOCUMENT_SET_PREFIX}:${id}`;

          await valkeyClient.set(key, JSON.stringify(documents), { EX: DOCUMENT_SET_TTL_SECONDS });

          return reply.status(200).send({ id });
        },
      )

      .get(
        '/document-set/:id',
        {
          schema: {
            tags: ['dokumenter'],
            params: DOCUMENT_SET_PARAMS,
            produces: ['application/json'],
            response: {
              200: DOCUMENT_SET_GET_RESPONSE,
              404: Type.Object({ error: Type.String() }),
            },
          },
        },
        async (req, reply) => {
          const { id } = req.params;
          const key = `${DOCUMENT_SET_PREFIX}:${id}`;

          const value = await valkeyClient.get(key);

          if (value === null) {
            return reply.status(404).send({ error: 'Document set not found' });
          }

          const references: IArchivedReference[] = JSON.parse(value);

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
                    msg: 'Failed to fetch document metadata',
                    data: { status: response.status, journalpostId, dokumentInfoId },
                  });

                  return null;
                }

                const json: unknown = await response.json();

                if (!Value.Check(ArchivedDocumentMetadataSchema, json)) {
                  log.warn({
                    msg: 'Invalid metadata response',
                    data: { journalpostId, dokumentInfoId },
                  });

                  return null;
                }

                return json;
              } catch (error) {
                log.warn({
                  msg: 'Error fetching document metadata',
                  data: { journalpostId, dokumentInfoId, error: String(error) },
                });

                return null;
              }
            }),
          );

          reply.addServerTiming('metadata_request_time', getDuration(metadataStart), 'Metadata Request Time');

          const documents = metadataResults.filter(
            (metadata): metadata is IArchivedDocumentMetadata => metadata?.hasAccess === true,
          );

          return reply.status(200).send({ documents });
        },
      );
  },
  { fastify: '5', name: 'document-set', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);
