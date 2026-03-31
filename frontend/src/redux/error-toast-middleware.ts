import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';
import { bffErrorToast, genericErrorToast, kabalErrorToast } from '@/components/toast/toast-content/api-error-toast';
import { isObject } from '@/functions/object';
import { behandlingerMutationSlice } from '@/redux-api/oppgaver/mutations/behandling';
import { documentsMutationSlice } from '@/redux-api/oppgaver/mutations/documents';
import { oppgaveDataQuerySlice } from '@/redux-api/oppgaver/queries/oppgave-data';
import { isBFFError, isKabalApiErrorData } from '@/types/errors';

const { finishOppgavebehandlingWithUpdateInGosys } = behandlingerMutationSlice.endpoints;
const { finishDocument } = documentsMutationSlice.endpoints;
const { getOppgave } = oppgaveDataQuerySlice.endpoints;

/** Extract the trace ID (32 hex chars) from a W3C traceparent header value. */
const extractTraceId = (meta: unknown): string | undefined => {
  if (!isObject(meta) || !('baseQueryMeta' in meta) || !isObject(meta.baseQueryMeta)) {
    return undefined;
  }

  const { baseQueryMeta } = meta;

  if (!('request' in baseQueryMeta) || !(baseQueryMeta.request instanceof Request)) {
    return undefined;
  }

  const traceparent = baseQueryMeta.request.headers.get('traceparent');

  if (traceparent === null) {
    return undefined;
  }

  return traceparent.split('-')[1];
};

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  if (!isRejectedWithValue(action)) {
    return next(action);
  }

  const { payload, meta } = action;

  // Don't show error toasts for specific errors - they spawn their own error components
  if (isArg(meta.arg) && handleError(payload, meta.arg)) {
    return next(action);
  }

  const traceId = extractTraceId(meta);

  if (isObject(payload) && 'data' in payload) {
    if (isKabalApiErrorData(payload.data)) {
      kabalErrorToast('En feil oppstod', payload.data, traceId);

      return next(action);
    }

    if (isBFFError(payload.data)) {
      bffErrorToast('En feil oppstod', payload.data, traceId);

      return next(action);
    }
  }

  genericErrorToast('Ukjent feil', `Detaljer: ${JSON.stringify(payload)}`, traceId);

  return next(action);
};

const handleError = (payload: unknown, arg: Arg): boolean => {
  if (!isPayload(payload)) {
    return false;
  }

  if (arg.endpointName === finishOppgavebehandlingWithUpdateInGosys.name && payload.status === 400) {
    return true;
  }

  if (arg.endpointName === finishDocument.name && payload.status === 400) {
    return true;
  }

  if (arg.endpointName === getOppgave.name && payload.status === 403) {
    return true;
  }

  return false;
};

type Arg = { endpointName: string };
const isArg = (obj: unknown): obj is Arg =>
  isObject(obj) && 'endpointName' in obj && typeof obj.endpointName === 'string';

type Payload = {
  status: number;
  data: unknown;
};

const isPayload = (obj: unknown): obj is Payload =>
  isObject(obj) && 'status' in obj && typeof obj.status === 'number' && 'data' in obj;
