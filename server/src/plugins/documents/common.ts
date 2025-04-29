import { ApiClientEnum } from '@app/config/config';
import { isDeployed } from '@app/config/env';
import { getDuration } from '@app/helpers/duration';
import { getProxyRequestHeaders } from '@app/helpers/prepare-request-headers';
import { getLogger } from '@app/logger';
import { SERVER_TIMING_HEADER } from '@app/plugins/server-timing';
import { type Static, Type } from '@fastify/type-provider-typebox';
import type { FastifyReply, FastifyRequest } from 'fastify';

interface IBaseMetadata {
  title: string;
}

export interface IArchivedReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export type IArchivedMetadata = IBaseMetadata & IArchivedReference;

export interface INewMetadata extends IBaseMetadata {
  behandlingId: string;
  documentId: string;
}

export interface ICombinedMetadata extends IBaseMetadata {
  mergedDocumentId: string;
  archivedDocuments: IArchivedReference[];
}

type Metadata = IArchivedMetadata | INewMetadata | ICombinedMetadata;

export const METADATA_BASE_URL = isDeployed ? 'http://kabal-api' : 'https://kabal.intern.dev.nav.no/api/kabal-api';

const log = getLogger('document-routes');

export const invalidId = (reply: FastifyReply) => reply.type('text/plain').status(400).send('Invalid id');

export const getMetadata = async <T extends Metadata>(
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

export const DEFAULT_NEW_METADATA: INewMetadata = {
  behandlingId: '',
  documentId: '',
  title: 'Ukjent dokument',
};

export const DEFAULT_ARCHIVED_METADATA: IArchivedMetadata = {
  journalpostId: '',
  dokumentInfoId: '',
  title: 'Ukjent dokument',
};

export const DEFAULT_COMBINED_METADATA: ICombinedMetadata = {
  mergedDocumentId: '',
  archivedDocuments: [],
  title: 'Ukjent dokument',
};

export const QUERYSTRING = Type.Object({
  version: Type.Optional(Type.String()),
});

type QuerystringType = Static<typeof QUERYSTRING>;

export const getQuery = (query: QuerystringType): string => {
  const { version } = query;

  return version !== undefined && isPlainText(version) ? `?version=${version}` : '';
};

const PLAIN_TEXT_REGEX = /^[\w-]{1,36}$/;

export const isPlainText = (id: string) => PLAIN_TEXT_REGEX.test(id);
