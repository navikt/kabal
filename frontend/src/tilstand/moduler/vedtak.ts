import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { concat, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, timeout } from 'rxjs/operators';
import { toasterSett, toasterSkjul } from './toaster';
import { RootState } from '../root';
import { Dependencies } from '../konfigurerTilstand';
import { fromPromise } from 'rxjs/internal-compatibility';
import { CustomError } from './error-types';
import { VEDLEGG_OPPDATERT, VEDTAK_FULLFOERT } from './klagebehandling/state';
import { IVedleggResponse, IVedtakFullfoertResponse } from './klagebehandling/types';

//==========
// Type defs
//==========
export interface IVedtakState {
  loading: boolean;
}

export interface IVedleggInput {
  klagebehandlingId: string;
  vedtakId: string;
  file: File;
  journalfoerendeEnhet: string;
  klagebehandlingVersjon: number;
}

export interface IVedleggDeleteInput {
  klagebehandlingId: string;
  vedtakId: string;
  klagebehandlingVersjon: number;
}

export interface IFullfoerVedtakParams {
  klagebehandlingId: string;
  vedtakId: string;
  journalfoerendeEnhet: string;
  klagebehandlingVersjon: number;
}

//==========
// Reducer
//==========
export const initialState: IVedtakState = {
  loading: false,
};

export const slice = createSlice({
  name: 'vedtak',
  initialState,
  reducers: {
    DONE: (state) => {
      state.loading = false;
      return state;
    },
    LOADING: (state) => {
      state.loading = true;
      return state;
    },
    ERROR: (state, action: PayloadAction<Error>) => {
      console.error(action.payload);
      state.loading = false;
      return state;
    },
  },
});

export default slice.reducer;

//==========
// Actions
//==========
export const { DONE, LOADING, ERROR } = slice.actions;
export const lastOppVedlegg = createAction<IVedleggInput>('vedtak/LAST_OPP_VEDLEGG');
export const slettVedlegg = createAction<IVedleggDeleteInput>('vedtak/SLETT_VEDLEGG');
export const fullfoerVedtak = createAction<IFullfoerVedtakParams>('vedtak/FULLFOER');

const getVedtakURL = (klagebehandlingId: string, vedtakId: string) =>
  `/api/klagebehandlinger/${klagebehandlingId}/vedtak/${vedtakId}`;

interface Properties {
  [key: string]: 'string' | 'number' | 'object' | Properties;
}

const VEDTAK_FULLFOERT_TYPE: Properties = {
  klagebehandlingVersjon: 'number',
  modified: 'string', // LocalDateTime;
  ferdigstilt: 'string', // LocalDateTime;
  avsluttetAvSaksbehandler: 'string', // LocalDate;
};

const VEDLEGG_KEYS: Properties = {
  name: 'string',
  size: 'number',
  opplastet: 'string',
};

const VEDLEGG_RESPONSE_KEYS: Properties = {
  klagebehandlingVersjon: 'number',
  modified: 'string',
  file: VEDLEGG_KEYS,
};

const isOfType = <T>(payload: any, type: Properties): payload is T => {
  if (typeof payload === 'object' && payload !== null) {
    const keys = Object.keys(payload);
    const expectedKeys = Object.keys(type);
    return (
      keys.length === expectedKeys.length &&
      expectedKeys.every((key) => {
        if (!keys.includes(key)) {
          return false;
        }
        const t = type[key];
        const d = payload[key];
        if (typeof t === 'string') {
          return typeof d === t;
        }
        if (d === null) {
          return true;
        }
        return isOfType(d, t);
      })
    );
  }
  return false;
};

const displayToast = (feilmelding: string) =>
  toasterSett({
    display: true,
    type: 'feil',
    feilmelding,
  });
