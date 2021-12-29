import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { OppgaveType } from './oppgavebehandling-common-types';

const isLocalhost = window.location.hostname === 'localhost';
export const baseUrl = isLocalhost ? 'https://kabal.dev.nav.no' : '/';
const mode: RequestMode | undefined = isLocalhost ? 'cors' : undefined;

export const klageApiUrl = '/api/kabal-api/';
export const ankeApiUrl = '/api/kabal-anke-api/';

const klagebehandlingUrl = klageApiUrl + 'klagebehandlinger/';
const ankebehandlingUrl = ankeApiUrl + 'ankebehandlinger/';

export const apiUrl = (type: OppgaveType) => (type === OppgaveType.KLAGEBEHANDLING ? klageApiUrl : ankeApiUrl);

export const oppgavebehandlingApiUrl = (type: OppgaveType) =>
  type === OppgaveType.KLAGEBEHANDLING ? klagebehandlingUrl : ankebehandlingUrl;

export const staggeredBaseQuery = retry(
  async (args: string | FetchArgs, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl,
      mode,
      credentials: 'include',
    })(args, api, extraOptions);

    if (typeof result.error === 'undefined') {
      return result;
    }

    const { status } = result.error;

    if (status === 401) {
      if (!isLocalhost) {
        window.location.reload();
      }

      retry.fail(result.error);
    }

    if (status === 400 || status === 403 || status === 404) {
      retry.fail(result.error);
    }

    return result;
  },
  {
    maxRetries: 3,
  }
);
