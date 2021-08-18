import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { of } from "rxjs";
import { catchError, map, mergeMap, retryWhen, timeout, withLatestFrom } from "rxjs/operators";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { Dependencies } from "../konfigurerTilstand";

//==========
// Interfaces
//==========
export interface IKvalitetsvurdering {
  klagebehandlingId: string;
  klagebehandlingVersjon: number;
  inkluderteDatoForKlage?: boolean;
  inkluderteDatoForVedtak?: boolean;
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
      console.error(action.payload);
      return state;
    },
  },
});

export default kvalitetsvurderingSlice.reducer;

//==========
// Actions
//==========
export const { HENTET, FEILET } = kvalitetsvurderingSlice.actions;
export const hentKvalitetsvurdering = createAction<string>("kvalitetsvurdering/HENT");
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

export function kvalitetsvurderingEpos(
  action$: ActionsObservable<PayloadAction<string>>,
  state$: StateObservable<RootStateOrAny>,
  { ajax }: Dependencies
) {
  return action$.pipe(
    ofType(hentKvalitetsvurdering.type),
    mergeMap((action) => {
      return ajax
        .getJSON<IKvalitetsvurdering>(url(action.payload))
        .pipe(
          timeout(5000),
          map((response) => response)
        )
        .pipe(map((data: IKvalitetsvurdering) => hentetHandling(data)))
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.response.detail));
          })
        );
    })
  );
}
export function lagreKvalitetsvurderingEpos(
  action$: ActionsObservable<PayloadAction<Partial<IKvalitetsvurdering>>>,
  state$: StateObservable<RootStateOrAny>,
  { ajax }: Dependencies
) {
  return action$.pipe(
    ofType(lagreKvalitetsvurdering.type),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      console.debug(action.payload, {
        url: `${url(action.payload.klagebehandlingId!)}/editerbare`,
      });
      return ajax
        .put(
          `${url(action.payload.klagebehandlingId!)}/editerbare`,
          {
            ...state.kvalitetsvurdering,
            ...action.payload,
          },
          { "Content-Type": "application/json" }
        )
        .pipe(
          timeout(5000),
          map((response) => response)
        )
        .pipe(map((data) => lagretHandling({ ...action.payload, ...data.response })))
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.response.detail));
          })
        );
    })
  );
}

export const KVALITETSVURDERING_EPICS = [kvalitetsvurderingEpos, lagreKvalitetsvurderingEpos];
