import { bffErrorToast, genericErrorToast, kabalErrorToast } from '@app/components/toast/toast-content/api-error-toast';
import { isObject } from '@app/functions/object';
import { behandlingerMutationSlice } from '@app/redux-api/oppgaver/mutations/behandling';
import { documentsMutationSlice } from '@app/redux-api/oppgaver/mutations/documents';
import { isBFFError, isKabalApiErrorData } from '@app/types/errors';
import { isRejectedWithValue, type Middleware } from '@reduxjs/toolkit';

const { finishOppgavebehandlingWithUpdateInGosys } = behandlingerMutationSlice.endpoints;
const { finishDocument } = documentsMutationSlice.endpoints;

export const errorToastMiddleware: Middleware = () => (next) => (action) => {
  if (!isRejectedWithValue(action)) {
    return next(action);
  }

  const { payload, meta } = action;

  // Don't show error toasts for specific validation errors - they spawn their own error components
  if (isPayload(payload) && payload.status === 400 && isArg(meta.arg)) {
    if (
      meta.arg.endpointName === finishOppgavebehandlingWithUpdateInGosys.name ||
      meta.arg.endpointName === finishDocument.name
    ) {
      return next(action);
    }
  }

  if (isObject(payload) && 'data' in payload) {
    if (isKabalApiErrorData(payload.data)) {
      kabalErrorToast('En feil oppstod', payload.data);

      return next(action);
    }

    if (isBFFError(payload.data)) {
      bffErrorToast('En feil oppstod', payload.data);

      return next(action);
    }
  }

  genericErrorToast('Ukjent feil', `Detaljer: ${JSON.stringify(payload)}`);

  return next(action);
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
