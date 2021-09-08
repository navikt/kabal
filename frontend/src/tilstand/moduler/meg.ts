import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { concat } from "rxjs";
import {
  catchError,
  concatAll,
  debounceTime,
  map,
  mergeMap,
  retryWhen,
  switchMap,
  throttleTime,
  timeout,
  withLatestFrom,
} from "rxjs/operators";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { Filter, oppgaveHentingFeilet as oppgaveFeiletHandling } from "./oppgave";
import { toasterSett, toasterSkjul } from "./toaster";
import { Dependencies } from "../konfigurerTilstand";
import { RootState } from "../root";
import { AlertStripeType } from "nav-frontend-alertstriper";

//==========
// Interfaces
//==========
export interface MegType {
  graphData: {
    navn: string;
    fornavn: string;
    mail: string;
    id: string;
    etternavn: string;
  };
  enheter: Array<IEnhetData>;
  valgtEnhet: IEnhetData;
  innstillinger?: IInnstillinger;
}

interface Graphdata {
  givenName: string;
  surname: string;
  onPremisesSamAccountName: string;
  displayName: string;
  mail: string;
}

export interface IEnhetData {
  id: string;
  navn: string;
  lovligeTemaer?: [Filter];
}

export interface ISettEnhet {
  navIdent: string;
  enhetId: string;
}

export interface Faner {
  /**
   * ID til fane, og hvorvidt den er aktiv eller ikke.
   */
  dokumenter?: {
    checked?: boolean;
  };
  detaljer?: {
    checked?: boolean;
  };
  kvalitetsvurdering?: {
    checked?: boolean;
  };
  vedtak?: {
    checked?: boolean;
  };
}

interface GraphOgEnhet extends Graphdata, Array<IEnhetData> {}

export interface IInnstillinger {
  aktiveHjemler: Array<Filter>;
  aktiveTemaer: Array<Filter>;
  aktiveTyper: Array<Filter>;
  aktiveFaner: Faner;
}

export interface IInnstillingerPayload {
  navIdent: string;
  enhetId: string;
  innstillinger: {
    aktiveHjemler?: Array<Filter>;
    aktiveTemaer?: Array<Filter>;
    aktiveTyper?: Array<Filter>;
    aktiveFaner: Faner;
  };
}

export interface IHentInnstilingerPayload {
  navIdent: string;
  enhetId: string;
}
export interface IError {
  message?: string;
  status?: string;
}
//==========
// Reducer
//==========
export const megSlice = createSlice({
  name: "meg",
  initialState: <MegType>{
    graphData: {
      id: "",
      navn: "",
      fornavn: "",
      mail: "",
      etternavn: "",
    },
    valgtEnhet: {
      id: "",
      navn: "",
      lovligeTemaer: undefined,
    },
    lovligeTemaer: undefined,
    enheter: [],
    innstillinger: undefined,
  },
  reducers: {
    MEG_HENTET: (state, action: PayloadAction<MegType>) => {
      let person = action.payload.graphData;
      state.graphData.fornavn = person.fornavn;
      state.graphData.etternavn = person.etternavn;
      state.graphData.navn = person.navn;
      state.graphData.id = person.id;
      state.graphData.mail = person.mail;
      state.enheter = action.payload.enheter;
      state.valgtEnhet = action.payload.valgtEnhet;
      return state;
    },
    MEG_HENTET_UTEN_ENHETER: (state, action: PayloadAction<MegType>) => {
      let person = action.payload.graphData;
      state.graphData.fornavn = person.fornavn;
      state.graphData.etternavn = person.etternavn;
      state.graphData.navn = person.navn;
      state.graphData.id = person.id;
      state.graphData.mail = person.mail;
      state.enheter = [];
      return state;
    },
    INNSTILLINGER_HENTET: (state, action: PayloadAction<IInnstillinger>) => {
      state.innstillinger = action.payload;
      return state;
    },
    INNSTILLINGER_SETT: (state, action: PayloadAction<IInnstillinger>) => {
      state.innstillinger = action.payload;
      return state;
    },
    INNSTILLINGER_SATT: (state, action: PayloadAction<IInnstillinger>) => {
      state.innstillinger = action.payload;
      return state;
    },
    ENHET_LAGRET: (state, action: PayloadAction<IEnhetData>) => {
      state.valgtEnhet = action.payload;
      return state;
    },
    FEILET: (state, action: PayloadAction<string>) => {},
  },
});

export default megSlice.reducer;

//==========
// Actions
//==========
export const { MEG_HENTET, FEILET, ENHET_LAGRET } = megSlice.actions;
export const hentMegHandling = createAction("meg/HENT_MEG");
export const hentMegUtenEnheterHandling = createAction("meg/HENT_MEG_UTEN_ENHETER");
export const hentetMegHandling = createAction<Partial<MegType>>("meg/MEG_HENTET");
export const hentetUtenEnheterHandling = createAction<Partial<MegType>>(
  "meg/MEG_HENTET_UTEN_ENHETER"
);
export const settEnhetHandling = createAction<ISettEnhet>("meg/SETT_ENHET");
export const sattInnstillinger = createAction<IInnstillinger>("meg/INNSTILLINGER_SATT");
export const hentInnstillingerHandling =
  createAction<IHentInnstilingerPayload>("meg/HENT_INNSTILLINGER");
export const hentetInnstillingerHandling = createAction<IInnstillinger>("meg/INNSTILLINGER_HENTET");
export const settInnstillingerHandling =
  createAction<IInnstillingerPayload>("meg/INNSTILLINGER_SETT");
export const feiletHandling = createAction<string>("meg/FEILET");

//==========
// Vis feilmeldinger ved feil
//==========

export function displayToast(error: IError, type: AlertStripeType = "feil") {
  const message = error?.message || error;
  return toasterSett({
    display: true,
    type,
    feilmelding: typeof message === "string" ? message : JSON.stringify(message),
  });
}

export function skjulToaster() {
  return toasterSkjul(15);
}
