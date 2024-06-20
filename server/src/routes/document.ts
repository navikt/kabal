import fs from 'fs';
import path from 'path';
import { getLogger } from '@app/logger';
import { Context, Hono } from 'hono';
import { prepareRequestHeaders } from '@app/helpers/prepare-request-headers';
import { oboTokenMiddleware } from '@app/middleware/obo-token';
import { setMetric } from 'hono/timing';
import { getDuration } from '@app/helpers/duration';
import { isDeployed } from '@app/config/env';

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

export const setupDocumentRoutes = (app: Hono) => {
  const TEMPLATE = fs.readFileSync(path.join(process.cwd(), './src/templates/document-template.html'), 'utf8');

  if (isDeployed) {
    ['/arkivert-dokument/*', '/nytt-dokument/*', '/vedleggsoversikt/*', '/kombinert-dokument/*'].forEach((route) => {
      app.use(route, oboTokenMiddleware('kabal-api', route));
    });
  }

  app.get('/arkivert-dokument/:journalpostId/:dokumentInfoId', async (context) => {
    const { journalpostId, dokumentInfoId } = context.req.param();

    if (!isPlainText(journalpostId) || !isPlainText(dokumentInfoId)) {
      return context.text('Invalid id', 400);
    }

    const metadataResponse = await getMetadata<IArchivedMetadata>(
      `${METADATA_BASE_URL}/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}`,
      context,
    );
    const metadata = metadataResponse ?? DEFAULT_ARCHIVED_METADATA;

    const queryAndHash = getQueryAndHash(context);
    const url = `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getJournalfoertDocumentDocumentId(journalpostId, dokumentInfoId)]);
    const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    return context.html(templateResult);
  });

  app.get('/nytt-dokument/:behandlingId/:documentId', async (context) => {
    const { behandlingId, documentId } = context.req.param();

    if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
      return context.text('Invalid id', 400);
    }

    const metadataResponse = await getMetadata<INewMetadata>(
      `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/title`,
      context,
    );
    const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

    const queryAndHash = getQueryAndHash(context);
    const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getNewDocumentDocumentId(documentId)]);

    const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    return context.html(templateResult);
  });

  app.get('/vedleggsoversikt/:behandlingId/:documentId', async (context) => {
    const { behandlingId, documentId } = context.req.param();

    if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
      return context.text('Invalid id', 400);
    }

    const metadataResponse = await getMetadata<INewMetadata>(
      `${METADATA_BASE_URL}/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt`,
      context,
    );
    const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

    const queryAndHash = getQueryAndHash(context);
    const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getAttachmentsOverviewTabId(documentId)]);
    const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    return context.html(templateResult);
  });

  app.get('/kombinert-dokument/:id', async (context) => {
    const { id } = context.req.param();

    if (!isPlainText(id)) {
      return context.text('Invalid id', 400);
    }

    const metadataResponse = await getMetadata<ICombinedMetadata>(
      `${METADATA_BASE_URL}/journalposter/mergedocuments/${id}`,
      context,
    );
    const metadata = metadataResponse ?? DEFAULT_COMBINED_METADATA;

    const queryAndHash = getQueryAndHash(context);
    const url = `/api/kabal-api/journalposter/mergedocuments/${id}/pdf${queryAndHash}`;
    const combinedDocumentId = getMergedDocumentDocumentIdId(id);
    const documentIdList = JSON.stringify([
      combinedDocumentId,
      ...metadata.archivedDocuments.map((d) => getJournalfoertDocumentDocumentId(d.journalpostId, d.dokumentInfoId)),
    ]);

    const templateResult = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    return context.html(templateResult);
  });
};

const getMetadata = async <T extends Metadata>(url: string, context: Context): Promise<T | null> => {
  const headers = prepareRequestHeaders(context, 'kabal-api');

  const metadataReqStart = performance.now();

  const response = await fetch(url, { method: 'GET', headers });

  setMetric(context, 'metadata_request_time', getDuration(metadataReqStart), 'Metadata Request Time');

  log.debug({ msg: 'Metadata response', data: { status: response.status, url } });

  if (!response.ok) {
    log.warn({ msg: 'Failed to fetch metadata', data: { status: response.status, url } });

    return null;
  }

  const json = await response.json();

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

const getQueryAndHash = (context: Context): string => {
  const { version, toolbar, view, zoom } = context.req.query();

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
