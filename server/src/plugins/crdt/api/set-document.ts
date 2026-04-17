import type { IncomingHttpHeaders } from 'node:http';
import type { Document } from '@hocuspocus/server';
import { yTextToSlateElement } from '@slate-yjs/core';
import { encodeStateAsUpdateV2, XmlText } from 'yjs';
import { ApiClientEnum } from '@/config/config';
import { stripBearer } from '@/headers';
import { withSpan } from '@/helpers/tracing';
import { getLogger } from '@/logger';
import { KABAL_API_URL } from '@/plugins/crdt/api/url';
import { getCloseEvent } from '@/plugins/crdt/close-event';
import type { ConnectionContext } from '@/plugins/crdt/context';
import { getOboToken } from '@/plugins/obo-token';

const log = getLogger('collaboration');

export const getDocumentJson = (document: Document) => {
  const sharedRoot = document.get('content', XmlText);

  return yTextToSlateElement(sharedRoot).children;
};

export const setDocument = async (context: ConnectionContext, document: Document, headers: IncomingHttpHeaders) => {
  const { behandlingId, dokumentId, navIdent, tab_id, client_version } = context;

  return withSpan(
    'collaboration.set_document',
    {
      behandling_id: behandlingId,
      dokument_id: dokumentId,
      nav_ident: navIdent,
      tab_id: tab_id ?? '',
      client_version,
    },
    async (span) => {
      const accessToken = stripBearer(headers.authorization);

      if (accessToken === undefined) {
        log.error({
          msg: 'Missing authorization header. Closing connection.',
          tab_id,
          client_version,
          data: { behandlingId, dokumentId },
        });

        throw getCloseEvent('MISSING_AUTHORIZATION', 4401);
      }

      const authorization = `Bearer ${await getOboToken(ApiClientEnum.KABAL_API, { ...context, accessToken })}`;

      try {
        const update = Buffer.from(encodeStateAsUpdateV2(document));
        const data = update.toString('base64url');

        const content = getDocumentJson(document);

        const res = await fetch(`${KABAL_API_URL}/behandlinger/${behandlingId}/smartdokumenter/${dokumentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', authorization },
          body: JSON.stringify({ content, data }),
        });

        span.setAttribute('http.status_code', res.status);

        if (!res.ok) {
          const msg = `Failed to save document. API responded with status code ${res.status}.`;
          const text = await res.text();

          log.error({
            msg,
            tab_id,
            client_version,
            data: { behandlingId, dokumentId, statusCode: res.status, response: text },
          });

          throw new ResponseError(`${msg} - ${text}`, res.status);
        }

        return res;
      } catch (error) {
        if (isResponseError(error)) {
          // Do not double log ResponseError
          throw error;
        }

        log.error({
          msg: 'Error while saving document to Kabal API',
          tab_id,
          client_version,
          data: { behandlingId, dokumentId },
          error,
        });

        throw error;
      }
    },
  );
};

class ResponseError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message);
  }
}

export const isResponseError = (error: unknown): error is ResponseError => error instanceof ResponseError;
