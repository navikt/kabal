import fs from 'fs';
import { IncomingHttpHeaders } from 'http';
import path from 'path';
import { Router } from 'express';
import fetch, { Headers } from 'node-fetch';

const router = Router();

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

export const setupDocumentRoutes = () => {
  const TEMPLATE = fs.readFileSync(path.join(process.cwd(), './dist/templates/document-template.html'), 'utf8');

  router.get('/arkivert-dokument/:journalpostId/:dokumentInfoId', async (req, res) => {
    const { journalpostId, dokumentInfoId } = req.params;

    if (!isPlainText(journalpostId) || !isPlainText(dokumentInfoId)) {
      return res.status(400).send('Invalid id');
    }

    const metadataResponse = await getMetadata<IArchivedMetadata>(
      `http://kabal-frontend/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}`,
      req.headers,
    );
    const metadata = metadataResponse ?? DEFAULT_ARCHIVED_METADATA;

    const queryAndHash = getQueryAndHash(queryToRecord(req.query));
    const url = `/api/kabal-api/journalposter/${journalpostId}/dokumenter/${dokumentInfoId}/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getJournalfoertDocumentDocumentId(journalpostId, dokumentInfoId)]);

    const html = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    res.send(html);
  });

  router.get('/nytt-dokument/:behandlingId/:documentId', async (req, res) => {
    const { behandlingId, documentId } = req.params;

    if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
      return res.status(400).send('Invalid id');
    }

    const metadataResponse = await getMetadata<INewMetadata>(
      `http://kabal-frontend/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}`,
      req.headers,
    );
    const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

    const queryAndHash = getQueryAndHash(queryToRecord(req.query));
    const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getNewDocumentDocumentId(documentId)]);

    const html = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    res.send(html);
  });

  router.get('/vedleggsoversikt/:behandlingId/:documentId', async (req, res) => {
    const { behandlingId, documentId } = req.params;

    if (!isPlainText(behandlingId) || !isPlainText(documentId)) {
      return res.status(400).send('Invalid id');
    }

    const metadataResponse = await getMetadata<INewMetadata>(
      `http://kabal-frontend/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt`,
      req.headers,
    );
    const metadata = metadataResponse ?? DEFAULT_NEW_METADATA;

    const queryAndHash = getQueryAndHash(queryToRecord(req.query));
    const url = `/api/kabal-api/behandlinger/${behandlingId}/dokumenter/${documentId}/vedleggsoversikt/pdf${queryAndHash}`;
    const documentIdList = JSON.stringify([getAttachmentsOverviewTabId(documentId)]);

    const html = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    res.send(html);
  });

  router.get('/kombinert-dokument/:id', async (req, res) => {
    const { id } = req.params;

    if (!isPlainText(id)) {
      return res.status(400).send('Invalid id');
    }

    const metadataResponse = await getMetadata<ICombinedMetadata>(
      `http://kabal-frontend/api/kabal-api/journalposter/mergedocuments/${id}`,
      req.headers,
    );
    const metadata = metadataResponse ?? DEFAULT_COMBINED_METADATA;

    const queryAndHash = getQueryAndHash(queryToRecord(req.query));
    const url = `/api/kabal-api/journalposter/mergedocuments/${id}/pdf${queryAndHash}`;
    const combinedDocumentId = getMergedDocumentDocumentIdId(id);
    const documentIdList = JSON.stringify([
      combinedDocumentId,
      ...metadata.archivedDocuments.map((d) => getJournalfoertDocumentDocumentId(d.journalpostId, d.dokumentInfoId)),
    ]);

    const html = TEMPLATE.replace('{{pdfUrl}}', url)
      .replace('{{document-id-list}}', documentIdList)
      .replace('{{title}}', metadata.title);

    res.send(html);
  });

  return router;
};

const getMetadata = async <T extends Metadata>(
  url: string,
  incomingHeaders: IncomingHttpHeaders,
): Promise<T | null> => {
  const headers = new Headers();

  for (const [key, value] of Object.entries(incomingHeaders)) {
    if (typeof value === 'string') {
      headers.append(key, value);
    }

    if (Array.isArray(value)) {
      value.forEach((v) => headers.append(key, v));
    }

    if (value === undefined) {
      headers.append(key, '');
    }
  }

  headers.set('Accept', 'application/json');

  const response = await fetch(url, { headers });

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

enum QueryKeyEnum {
  VERSION = 'version',
  TOOLBAR = 'toolbar',
  VIEW = 'view',
  ZOOM = 'zoom',
}

const getQueryAndHash = (query: Record<string, string | undefined>): string => {
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

const queryToRecord = (record: unknown): Record<QueryKeyEnum, string | undefined> => {
  if (record === null || typeof record !== 'object') {
    return {
      [QueryKeyEnum.VERSION]: undefined,
      [QueryKeyEnum.TOOLBAR]: undefined,
      [QueryKeyEnum.VIEW]: undefined,
      [QueryKeyEnum.ZOOM]: undefined,
    };
  }

  return {
    [QueryKeyEnum.VERSION]: QueryKeyEnum.VERSION in record ? getQueryValue(record[QueryKeyEnum.VERSION]) : undefined,
    [QueryKeyEnum.TOOLBAR]: QueryKeyEnum.TOOLBAR in record ? getQueryValue(record[QueryKeyEnum.TOOLBAR]) : undefined,
    [QueryKeyEnum.VIEW]: QueryKeyEnum.VIEW in record ? getQueryValue(record[QueryKeyEnum.VIEW]) : undefined,
    [QueryKeyEnum.ZOOM]: QueryKeyEnum.ZOOM in record ? getQueryValue(record[QueryKeyEnum.ZOOM]) : undefined,
  };
};

const getQueryValue = (value: unknown): string | undefined => {
  if (typeof value === 'undefined') {
    return undefined;
  }

  if (typeof value !== 'string') {
    return undefined;
  }

  return isPlainText(value) ? value : undefined;
};
