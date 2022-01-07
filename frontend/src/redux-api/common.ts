import { FetchArgs, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react';
import { OppgaveType } from '../types/kodeverk';

const isLocalhost = window.location.hostname === 'localhost';
export const baseUrl = isLocalhost ? 'https://kabal.dev.nav.no' : '';
const mode: RequestMode | undefined = isLocalhost ? 'cors' : undefined;

export const KLAGE_API_URL = '/api/kabal-api/';
export const ANKE_API_URL = '/api/kabal-anke-api/';

export const KLAGEBEHANDLING_URL = KLAGE_API_URL + 'klagebehandlinger/';
export const ANKEBEHANDLING_URL = ANKE_API_URL + 'ankebehandlinger/';

export const apiUrl = (type: OppgaveType) => (type === OppgaveType.KLAGEBEHANDLING ? KLAGE_API_URL : ANKE_API_URL);

export const oppgavebehandlingApiUrl = (type: OppgaveType) =>
  type === OppgaveType.KLAGEBEHANDLING ? KLAGEBEHANDLING_URL : ANKEBEHANDLING_URL;

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
