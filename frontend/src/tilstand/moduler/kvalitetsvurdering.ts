import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { concat, of } from "rxjs";
import {
  catchError,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  timeout,
  withLatestFrom,
} from "rxjs/operators";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { Dependencies } from "../konfigurerTilstand";
import { settKlageVersjon, settLedig, settOpptatt } from "./klagebehandling/actions";

//==========
// Interfaces
//==========
export interface IKvalitetsvurdering {
  klagebehandlingId: string;
  klagebehandlingVersjon: number;
  kvalitetOversendelsesbrevBra?: boolean;
  kommentarOversendelsesbrev?: string;
  kvalitetUtredningBra?: boolean;
  kvalitetsavvikUtredning: [];
  kvalitetsavvikOversendelsesbrev: [];
  kvalitetsavvikVedtak: [];
  kommentarUtredning: string;
  kvalitetVedtakBra?: boolean;
  kommentarVedtak?: string;
  avvikStorKonsekvens?: boolean;
  brukSomEksempelIOpplaering?: boolean;
  hentet: boolean;
  laster: boolean;
}

//==========
// Reducer
//==========
export const kvalitetsvurderingSlice = createSlice({
  name: "kvalitetsvurdering",
  initialState: {
    klagebehandlingId: "",
    klagebehandlingVersjon: 0,
    hentet: false,
    laster: true,
    kvalitetsavvikUtredning: [],
    kvalitetsavvikVedtak: [],
    kvalitetsavvikOversendelsesbrev: [],
  } as IKvalitetsvurdering,
  reducers: {
    HENTET: (state, action: PayloadAction<IKvalitetsvurdering>) => {
      return { ...state, ...action.payload, hentet: true, laster: false };
    },
    HENT: (state) => {
      return { ...state, hentet: false, laster: true };
    },
    SETT_VERSJON: (state, action: PayloadAction<number>) => {
      return { ...state, klagebehandlingVersjon: action.payload };
    },
    LAGRE: (state, action: PayloadAction<IKvalitetsvurdering>) => {
      return {
        ...state,
        ...action.payload,
        klagebehandlingVersjon: state.klagebehandlingVersjon,
        laster: true,
      };
    },
    LAGRET: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        laster: false,
        klagebehandlingVersjon: action.payload.klagebehandlingVersjon,
      };
    },
    FEILET: (state, action: PayloadAction<string>) => {
      console.error("kvalitetsvurdering feilet", action.payload);
      return state;
    },
  },
});

export default kvalitetsvurderingSlice.reducer;

//==========
// Actions
//==========
export const { HENTET, FEILET, SETT_VERSJON } = kvalitetsvurderingSlice.actions;
export const hentKvalitetsvurdering = createAction<string>("kvalitetsvurdering/HENT");
export const settVersjon = createAction<number>("kvalitetsvurdering/SETT_VERSJON");
export const hentVersjon = createAction<string>("kvalitetsvurdering/HENT_VERSJON");
export const lagreKvalitetsvurdering = createAction<Partial<IKvalitetsvurdering>>(
  "kvalitetsvurdering/LAGRE"
);
export const hentetHandling = createAction<IKvalitetsvurdering>("kvalitetsvurdering/HENTET");
export const lagretHandling = createAction<Partial<IKvalitetsvurdering>>(
  "kvalitetsvurdering/LAGRET"
);
export const feiletHandling = createAction<string>("kvalitetsvurdering/FEILET");

//==========
// Epos
//==========
const url = (id: string) => `/api/klagebehandlinger/${id}/kvalitetsvurdering`;
