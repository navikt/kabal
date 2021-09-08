import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import { IDokument } from './stateTypes';
import { IDokumenterRespons } from './types';

const sorterSynkendePaaRegistrert = (dokumenter: IDokument[]) => {
  if (dokumenter.length === 0) {
    return [];
  }
  return dokumenter.sort((a, b) => {
    if (a.registrert > b.registrert) {
      return -1;
    }
    if (a.registrert < b.registrert) {
      return 1;
    }
    return 0;
  });
};

export const dokumenterSlice = createSlice({
  name: 'dokumenter',
  initialState,
  reducers: {
    NULLSTILL_DOKUMENTER: (state) => ({
      ...state,
      ...initialState,
    }),
    LEGG_TIL_DOKUMENTER: (state, { payload }: PayloadAction<IDokumenterRespons>) => {
      state.dokumenter.pageReference = payload.pageReference;
      state.dokumenter.totaltAntall = payload.totaltAntall;
      state.dokumenter.dokumenter = [...state.dokumenter.dokumenter, ...payload.dokumenter];
      state.dokumenter.loading = false;
      return state;
    },
    SETT_TILKNYTTEDE_DOKUMENTER: (state, { payload }: PayloadAction<IDokument[]>) => {
      state.tilknyttedeDokumenter.dokumenter = sorterSynkendePaaRegistrert(payload);
      state.tilknyttedeDokumenter.loading = false;
      return state;
    },
    HENT_FILTRERTE_DOKUMENTER: (state) => ({
      ...state,
      ...initialState,
      dokumenter: {
        ...initialState.dokumenter,
        loading: true,
      },
    }),
    DOKUMENTER_LOADING: (state) => {
      state.dokumenter.loading = true;
      return state;
    },
    TILKNYTTEDE_DOKUMENTER_LOADING: (state) => {
      state.tilknyttedeDokumenter.loading = true;
      return state;
    },
    ERROR: (state, action: PayloadAction<string>) => ({
      ...state,
      error: action.payload,
      loading: false,
    }),
  },
});

export const {
  LEGG_TIL_DOKUMENTER,
  DOKUMENTER_LOADING,
  TILKNYTTEDE_DOKUMENTER_LOADING,
  ERROR,
  NULLSTILL_DOKUMENTER,
  SETT_TILKNYTTEDE_DOKUMENTER,
} = dokumenterSlice.actions;

export const dokumenter = dokumenterSlice.reducer;
