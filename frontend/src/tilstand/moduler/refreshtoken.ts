import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionsObservable, ofType, StateObservable } from "redux-observable";
import { catchError, map, mergeMap, retryWhen, timeout } from "rxjs/operators";
import { of } from "rxjs";
import { RootStateOrAny } from "react-redux";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { Dependencies } from "../konfigurerTilstand";

//==========
// Type defs
//==========

//==========
// Reducer
//==========
export const initialState = {};
export const slice = createSlice({
  name: "refreshtoken",
  initialState: initialState,
  reducers: {},
});

export default slice.reducer;

//==========
// Actions
//==========
export const hentToken = createAction("refreshtoken/HENT");
export const hentetHandling = createAction<string>("refreshtoken/HENTET");
export const feiletHandling = createAction<string>("refreshtoken/FEILET");

//==========
// Epos
//==========
export function hentNyttToken(
  action$: ActionsObservable<PayloadAction>,
  state$: StateObservable<RootStateOrAny>,
  { ajax }: Dependencies
) {
  return action$.pipe(
    ofType(hentToken.type),
    mergeMap((action) => {
      return ajax
        .getJSON<{ status: string }>("/internal/refresh")
        .pipe(
          timeout(5000),
          map((response) => response.status)
        )
        .pipe(map((data) => hentetHandling(data)))
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.message));
          })
        );
    })
  );
}

export const REFRESH_EPICS = [hentNyttToken];
