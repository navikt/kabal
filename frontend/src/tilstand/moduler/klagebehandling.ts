import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { concat, from, of } from "rxjs";
import {
  catchError,
  concatAll,
  map,
  mergeMap,
  retryWhen,
  timeout,
  withLatestFrom,
} from "rxjs/operators";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { AjaxCreationMethod } from "rxjs/internal-compatibility";
import { OppgaveParams } from "./oppgave";

//==========
// Interfaces
//==========
export interface IHjemmel {
  kapittel: number;
  paragraf: number;
  ledd?: number;
  bokstav?: string;
  original?: string;
}

export interface IKlage {
  id: string;
  klageInnsendtdato?: string;
  fraNAVEnhet: string;
  mottattFoersteinstans: string;
  foedselsnummer: string;
  tema: string;
  sakstype: string;
  mottatt: string;
  startet?: string;
  avsluttet?: string;
  frist: string;
  tildeltSaksbehandlerident?: string;
  hjemler: Array<IHjemmel>;
  pageReference: string | null;
  prevPageReference: string | null | undefined;
  dokumenter?: any;
}

interface IKlagePayload {
  id: string;
}

interface IDokumentParams {
  id: string;
  handling: string;
  antall: number;
}

//==========
// Reducer
//==========
export const klageSlice = createSlice({
  name: "klagebehandling",
  initialState: {
    id: "",
    klageInnsendtdato: undefined,
    fraNAVEnhet: "4416",
    mottattFoersteinstans: "2019-08-22",
    foedselsnummer: "29125639036",
    tema: "SYK",
    sakstype: "Klage",
    mottatt: "2021-01-26",
    startet: undefined,
    avsluttet: undefined,
    frist: "2019-12-05",
    tildeltSaksbehandlerident: undefined,
    prevPageReference: undefined,
    pageReference: null,
    hjemler: [],
  } as IKlage,
  reducers: {
    HENTET: (state, action: PayloadAction<IKlage>) => {
      state = action.payload;
      return state;
    },
    DOKUMENTER_HENTET: (state, action: PayloadAction<IKlage>) => {
      state.prevPageReference = state.pageReference;
      state.pageReference = action.payload.pageReference;
      state.dokumenter = action.payload.dokumenter;
      return state;
    },
    FEILET: (state, action: PayloadAction<string>) => {
      console.error(action.payload);
      return state;
    },
  },
});

export default klageSlice.reducer;

//==========
// Actions
//==========
export const { HENTET, FEILET } = klageSlice.actions;
export const hentKlageHandling = createAction<string>("klagebehandling/HENT_KLAGE");
export const hentetKlageHandling = createAction<IKlage>("klagebehandling/HENTET");
export const feiletHandling = createAction<string>("klagebehandling/FEILET");

export const hentetKlageDokumenterHandling = createAction<IKlage>(
  "klagebehandling/DOKUMENTER_HENTET"
);
export const hentDokumenterHandling = createAction<IDokumentParams>(
  "klagebehandling/HENT_KLAGE_DOKUMENTER"
);

//==========
// Epos
//==========
const klageUrl = (id: string) => `/api/klagebehandlinger/${id}`;
var resultData: IKlage;
const R = require("ramda");

export function klagebehandlingEpos(
  action$: ActionsObservable<PayloadAction<string>>,
  state$: StateObservable<RootStateOrAny>,
  { getJSON }: AjaxCreationMethod
) {
  return action$.pipe(
    ofType(hentKlageHandling.type),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      return getJSON<IKlagePayload>(klageUrl(action.payload))
        .pipe(
          timeout(5000),
          map((response: IKlagePayload) => response)
        )
        .pipe(
          map((data) => {
            return hentetKlageHandling(data as IKlage);
          })
        )
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.message));
          })
        );
    })
  );
}

export function klagebehandlingDokumenterEpos(
  action$: ActionsObservable<PayloadAction<IDokumentParams>>,
  state$: StateObservable<RootStateOrAny>,
  { getJSON }: AjaxCreationMethod
) {
  return action$.pipe(
    ofType(hentDokumenterHandling.type),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      let klageUrl = `/api/klagebehandlinger/${action.payload.id}/alledokumenter?antall=10`;
      if (action.payload.handling === "neste")
        klageUrl = `/api/klagebehandlinger/${action.payload.id}/alledokumenter?antall=10&forrigeSide=${state.klagebehandling.pageReference}`;
      if (action.payload.handling === "forrige")
        klageUrl = `/api/klagebehandlinger/${action.payload.id}/alledokumenter?antall=10&forrigeSide=${state.klagebehandling.prevPageReference}`;
      return getJSON<IKlagePayload>(klageUrl)
        .pipe(
          timeout(5000),
          map((response: IKlagePayload) => {
            return R.compose(R.omit("id"))(response);
          })
        )
        .pipe(
          map((data) => {
            return hentetKlageDokumenterHandling(data as any);
          })
        )
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.message));
          })
        );
    })
  );
}

export const KLAGEBEHANDLING_EPICS = [klagebehandlingEpos, klagebehandlingDokumenterEpos];
