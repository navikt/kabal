import { PayloadAction } from "@reduxjs/toolkit";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { of } from "rxjs";
import { catchError, map, mergeMap, retryWhen, timeout } from "rxjs/operators";
import { provIgjenStrategi } from "../../../utility/rxUtils";
import { Dependencies } from "../../konfigurerTilstand";
import { RootState } from "../../root";
import { toasterSett, toasterSkjul } from "../toaster";
import { hentDokumenter, hentTilknyttedeDokumenter } from "./actions";
import {
  ERROR,
  DOKUMENTER_LOADING,
  LEGG_TIL_DOKUMENTER,
  SETT_TILKNYTTEDE_DOKUMENTER,
  TILKNYTTEDE_DOKUMENTER_LOADING,
} from "./state";
import { IDokumenterParams, IDokumenterRespons } from "./types";

export const loadingDokumenterEpic = (action$: ActionsObservable<PayloadAction<never>>) =>
  action$.pipe(ofType(hentDokumenter.type), map(DOKUMENTER_LOADING));

export const loadingTilknyttedeDokumenterEpic = (
  action$: ActionsObservable<PayloadAction<never>>
) => action$.pipe(ofType(hentTilknyttedeDokumenter.type), map(TILKNYTTEDE_DOKUMENTER_LOADING));

export const hentDokumenterEpic = (
  action$: ActionsObservable<PayloadAction<IDokumenterParams>>,
  _: StateObservable<RootState> | null,
  { ajax }: Dependencies
) =>
  action$.pipe(
    ofType(hentDokumenter.type),
    mergeMap(({ payload: { klagebehandlingId, pageReference } }) =>
      ajax
        .getJSON<IDokumenterRespons>(
          `/api/klagebehandlinger/${klagebehandlingId}/alledokumenter?antall=10&forrigeSide=${
            pageReference ?? ""
          }`
        )
        .pipe(timeout(5000), map(LEGG_TIL_DOKUMENTER))
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) =>
            of(
              ERROR(error?.response?.detail || "feilet"),
              toasterSett({
                display: true,
                type: "feil",
                feilmelding: `Henting av dokumenter for klagebehandling "${klagebehandlingId}" feilet. Feilmelding: ${error?.response?.detail}`,
              }),
              toasterSkjul(15)
            )
          )
        )
    )
  );

export const hentTilknyttedeDokumenterEpic = (
  action$: ActionsObservable<PayloadAction<string>>,
  _: StateObservable<RootState> | null,
  { ajax }: Dependencies
) =>
  action$.pipe(
    ofType(hentTilknyttedeDokumenter.type),
    mergeMap(({ payload }) =>
      ajax
        .getJSON<IDokumenterRespons>(`/api/klagebehandlinger/${payload}/dokumenter`)
        .pipe(
          timeout(15000),
          map(({ dokumenter }) => SETT_TILKNYTTEDE_DOKUMENTER(dokumenter))
        )
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) =>
            of(
              ERROR(error?.response?.detail || "feilet"),
              toasterSett({
                display: true,
                type: "feil",
                feilmelding: `Henting av tilknyttede dokumenter for klagebehandling "${payload}" feilet. Feilmelding: ${error?.response?.detail}`,
              }),
              toasterSkjul(15)
            )
          )
        )
    )
  );
