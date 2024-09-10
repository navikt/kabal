import fs from 'node:fs';
import path from 'node:path';
import { getLogger } from '@app/logger';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getDuration } from '@app/helpers/duration';
import { isDeployed } from '@app/config/env';
import { FastifyReply, FastifyRequest } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { Static, Type, TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import { SERVER_TIMING_HEADER, SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { ApiClientEnum } from '@app/config/config';

interface IBaseMetadata {
  title: string;
}

interface IArchivedReference {
  journalpostId: string;
  dokumentInfoId: string;
}

type IArchivedMetadata = IBaseMetadata & IArchivedReference;

interface INewMetadata extends IBaseMetadata {
  behandlingId: string;
  documentId: string;
}

interface ICombinedMetadata extends IBaseMetadata {
  mergedDocumentId: string;
  archivedDocuments: IArchivedReference[];
}

type Metadata = IArchivedMetadata | INewMetadata | ICombinedMetadata;

const log = getLogger('document-routes');

const METADATA_BASE_URL = isDeployed ? 'http://kabal-api' : 'https://kabal.intern.dev.nav.no/api/kabal-api';

const TEMPLATE = fs.readFileSync(path.join(process.cwd(), './src/templates/document-template.html'), {
  encoding: 'utf8',
});

const QUERYSTRING = Type.Object({
  version: Type.Optional(Type.String()),
  toolbar: Type.Optional(Type.String()),
  view: Type.Optional(Type.String()),
  zoom: Type.Optional(Type.String()),
});

type QuerystringType = Static<typeof QUERYSTRING>;

export const documentPlugin = fastifyPlugin(
  (app, _, pluginDone) => {
    app
      .withTypeProvider<TypeBoxTypeProvider>()

      .get(
        '/arkivert-dokument/:journalpostId/:dokumentInfoId',
        {
          schema: {
            tags: ['dokumenter'],
            params: Type.Object({ journalpostId: Type.String(), dokumentInfoId: Type.String() }),
            querystring: QUERYSTRING,
            produces: ['application/pdf'],
            response: { 200: { type: 'string', format: 'binary' } },
          },
        },
        async (req, reply) => {
          const { journalpostId, dokumentInfoId } = req.params;

          if (!isPlainText(journalpostId) || !isPlainText(dokumentInfoId)) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<IArchivedMetadata>(
            `${METADATA_BASE_URL}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_ARCHIVED_METADATA;

          const queryAndHash = getQueryAndHash(req.query);
          const url = `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf${queryAndHash}`;
          const documentIdList = JSON.stringify([getJournalfoertDocumentDocumentId(journalpostId, dokumentInfoId)]);

          return send(reply, url, documentIdList, metadata.title);
        },
      )

      .get(
        '/nytt-dokument/:behandlingId/:documentId',
        {
          schema: {
            tags: ['dokumenter'],
            params: Type.Object({ behandlingId: Type.String(), documentId: Type.String() }),
            querystring: QUERYSTRING,
            produces: ['application/pdf'],
            response: { 200: { type: 'string', format: 'binary' } },
          },
        },
        async (req, reply) => {
          const { behandlingId, documentId } = req.params;

          if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<INewMetadata>(
            `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/title`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

          const queryAndHash = getQueryAndHash(req.query);
          const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf${queryAndHash}`;
          const documentIdList = JSON.stringify([getNewDocumentDocumentId(documentId)]);

          return send(reply, url, documentIdList, metadata.title);
        },
      )

      .get(
        '/vedleggsoversikt/:behandlingId/:documentId',
        {
          schema: {
            tags: ['dokumenter'],
            params: Type.Object({ behandlingId: Type.String(), documentId: Type.String() }),
            querystring: QUERYSTRING,
            produces: ['application/pdf'],
            response: { 200: { type: 'string', format: 'binary' } },
          },
        },
        async (req, reply) => {
          const { behandlingId, documentId } = req.params;

          if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<INewMetadata>(
            `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

          const queryAndHash = getQueryAndHash(req.query);
          const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf${queryAndHash}`;
          const documentIdList = JSON.stringify([getAttachmentsOverviewTabId(documentId)]);

          return send(reply, url, documentIdList, metadata.title);
        },
      )

      .get(
        '/kombinert-dokument/:id',
        {
          schema: {
            tags: ['dokumenter'],
            params: Type.Object({ id: Type.String() }),
            querystring: QUERYSTRING,
            produces: ['application/pdf'],
            response: { 200: { type: 'string', format: 'binary' } },
          },
        },
        async (req, reply) => {
          const { id } = req.params;

          if (!isPlainText(id)) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<ICombinedMetadata>(
            `${METADATA_BASE_URL}/journalposter/mergedocuments/${id}`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_COMBINED_METADATA;

          const queryAndHash = getQueryAndHash(req.query);
          const url = `/api/kabal-api/journalposter/mergedocuments/${id}/pdf${queryAndHash}`;
          const combinedDocumentId = getMergedDocumentDocumentIdId(id);
          const documentIdList = JSON.stringify([
            combinedDocumentId,
            ...metadata.archivedDocuments.map((d) =>
              getJournalfoertDocumentDocumentId(d.journalpostId, d.dokumentInfoId),
            ),
          ]);

          return send(reply, url, documentIdList, metadata.title);
        },
      );

    pluginDone();
  },
  { fastify: '4', name: 'document-routes', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);

const send = (reply: FastifyReply, url: string, documentIdList: string, title: string) => {
  const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
    .replace('{{document-id-list}}', documentIdList)
    .replace('{{title}}', title);

  return reply.type('text/html').status(200).send(templateResult);
};

const invalidId = (reply: FastifyReply) => reply.type('text/plain').status(400).send('Invalid id');

const getMetadata = async <T extends Metadata>(
  url: string,
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<T | null> => {
  const oboAccessToken = await req.getOboAccessToken(ApiClientEnum.KABAL_API, reply);

  const headers = getProxyRequestHeaders(req, ApiClientEnum.KABAL_API, oboAccessToken);

  const metadataReqStart = performance.now();

  const response = await fetch(url, { method: 'GET', headers });

  reply.addServerTiming('metadata_request_time', getDuration(metadataReqStart), 'Metadata Request Time');
  const serverTiming = response.headers.get(SERVER_TIMING_HEADER);

  if (serverTiming !== null) {
    reply.appendServerTimingHeader(serverTiming);
  }

  log.debug({ msg: 'Metadata response', data: { status: response.status, url } });

  if (!response.ok) {
    log.warn({ msg: 'Failed to fetch metadata', data: { status: response.status, url } });

    return null;
  }

  const json: unknown = await response.json();

  if (isMetadataResponse<T>(json)) {
    return json;
  }

  return null;
};

const isMetadataResponse = <T extends Metadata>(response: unknown): response is T => {
  if (response === null || typeof response !== 'object') {
    return false;
  }

  if (!('title' in response) || typeof response.title !== 'string') {
    return false;
  }

  if (
    'behandlingId' in response &&
    typeof response.behandlingId === 'string' &&
    'documentId' in response &&
    typeof response.documentId === 'string'
  ) {
    return true;
  }

  if (
    'journalpostId' in response &&
    typeof response.journalpostId === 'string' &&
    'dokumentInfoId' in response &&
    typeof response.dokumentInfoId === 'string'
  ) {
    return true;
  }

  if (
    'mergedDocumentId' in response &&
    typeof response.mergedDocumentId === 'string' &&
    'archivedDocuments' in response &&
    Array.isArray(response.archivedDocuments)
  ) {
    return true;
  }

  return false;
};

const DEFAULT_NEW_METADATA: INewMetadata = {
  behandlingId: '',
  documentId: '',
  title: 'Ukjent dokument',
};

const DEFAULT_ARCHIVED_METADATA: IArchivedMetadata = {
  journalpostId: '',
  dokumentInfoId: '',
  title: 'Ukjent dokument',
};

const DEFAULT_COMBINED_METADATA: ICombinedMetadata = {
  mergedDocumentId: '',
  archivedDocuments: [],
  title: 'Ukjent dokument',
};

const getQueryAndHash = (query: QuerystringType): string => {
  const { version, toolbar, view, zoom } = query;

  const versionQuery = version !== undefined && isPlainText(version) ? `?version=${version}` : '';

  const hash: string[] = [];

  if (toolbar !== undefined && isPlainText(toolbar)) {
    hash.push(`toolbar=${toolbar}`);
  }

  if (view !== undefined && isPlainText(view)) {
    hash.push(`view=${view}`);
  }

  if (zoom !== undefined && isPlainText(zoom)) {
    hash.push(`zoom=${zoom}`);
  }

  return `${versionQuery}#${hash.join('&')}`;
};

const getNewDocumentDocumentId = (documentId: string) => `new-document-${documentId}`;
const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;

const getJournalfoertDocumentDocumentId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

const getMergedDocumentDocumentIdId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;

const PLAIN_TEXT_REGEX = /^[\w-]{1,36}$/;

const isPlainText = (id: string) => PLAIN_TEXT_REGEX.test(id);
