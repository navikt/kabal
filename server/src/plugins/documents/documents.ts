import fs from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_ARCHIVED_METADATA,
  DEFAULT_COMBINED_METADATA,
  DEFAULT_NEW_METADATA,
  type IArchivedMetadata,
  type ICombinedMetadata,
  type INewMetadata,
  METADATA_BASE_URL,
  QUERYSTRING,
  getMetadata,
  getQuery,
  invalidId,
  isPlainText,
} from '@app/plugins/documents/helpers';
import { OBO_ACCESS_TOKEN_PLUGIN_ID } from '@app/plugins/obo-token';
import { SERVER_TIMING_PLUGIN_ID } from '@app/plugins/server-timing';
import { Type, type TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import type { FastifyReply } from 'fastify';
import fastifyPlugin from 'fastify-plugin';

const TEMPLATE = fs.readFileSync(path.join(process.cwd(), './src/templates/document-template.html'), {
  encoding: 'utf8',
});

export const documentPlugin = fastifyPlugin(
  async (app) => {
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

          if (!(isPlainText(journalpostId) && isPlainText(dokumentInfoId))) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<IArchivedMetadata>(
            `${METADATA_BASE_URL}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_ARCHIVED_METADATA;

          const query = getQuery(req.query);
          const url = `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf${query}`;
          const documentIdList = JSON.stringify([getJournalfoertDocumentDocumentId(journalpostId, dokumentInfoId)]);

          return sendDocument(reply, url, documentIdList, metadata.title, req.navIdent);
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

          if (!(isPlainText(behandlingId) && isPlainText(documentId))) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<INewMetadata>(
            `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/title`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

          const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/mergedocuments/${documentId}/pdf${getQuery(req.query)}`;
          const documentIdList = JSON.stringify([getNewDocumentDocumentId(documentId)]);

          return sendDocument(reply, url, documentIdList, metadata.title, req.navIdent);
        },
      )

      .get(
        '/nytt-dokumentvedlegg/:behandlingId/:documentId',
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

          if (!(isPlainText(behandlingId) && isPlainText(documentId))) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<INewMetadata>(
            `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/title`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

          const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf${getQuery(req.query)}`;
          const documentIdList = JSON.stringify([getNewDocumentAttachmentDocumentId(documentId)]);

          return sendDocument(reply, url, documentIdList, metadata.title, req.navIdent);
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

          if (!(isPlainText(behandlingId) && isPlainText(documentId))) {
            return invalidId(reply);
          }

          const metadataResponse = await getMetadata<INewMetadata>(
            `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt`,
            req,
            reply,
          );
          const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

          const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf${getQuery(req.query)}`;
          const documentIdList = JSON.stringify([getAttachmentsOverviewTabId(documentId)]);

          return sendDocument(reply, url, documentIdList, metadata.title, req.navIdent);
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

          const url = `/api/kabal-api/journalposter/mergedocuments/${id}/pdf${getQuery(req.query)}`;
          const combinedDocumentId = getMergedDocumentDocumentIdId(id);
          const documentIdList = JSON.stringify([
            combinedDocumentId,
            ...metadata.archivedDocuments.map((d) =>
              getJournalfoertDocumentDocumentId(d.journalpostId, d.dokumentInfoId),
            ),
          ]);

          return sendDocument(reply, url, documentIdList, metadata.title, req.navIdent);
        },
      );
  },
  { fastify: '5', name: 'document-routes', dependencies: [OBO_ACCESS_TOKEN_PLUGIN_ID, SERVER_TIMING_PLUGIN_ID] },
);

const sendDocument = (reply: FastifyReply, url: string, documentIdList: string, title: string, navIdent: string) => {
  const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
    .replace('{{document-id-list}}', documentIdList)
    .replace('{{title}}', title)
    .replace('{{navIdent}}', navIdent);

  return reply.type('text/html').status(200).send(templateResult);
};

const getNewDocumentDocumentId = (documentId: string) => `new-document-${documentId}`;
const getNewDocumentAttachmentDocumentId = (documentId: string) => `new-document-attachment-${documentId}`;
const getAttachmentsOverviewTabId = (documentId: string) => `attachments-overview-${documentId}`;

const getJournalfoertDocumentDocumentId = (journalpostId: string, dokumentInfoId: string) =>
  `archived-document-${journalpostId}-${dokumentInfoId}`;

const getMergedDocumentDocumentIdId = (mergedDocumentId: string) => `combined-document-${mergedDocumentId}`;
