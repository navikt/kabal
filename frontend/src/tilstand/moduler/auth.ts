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
interface IState {
  isAuth: undefined | boolean;
}
//==========
// Reducer
//==========
export const initialState: IState = {
  isAuth: undefined,
};
export const slice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    AUTH_RESULTAT: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
      return state;
    },
    FEILET: (state, action: PayloadAction<boolean>) => {
      state.isAuth = false;
      return state;
    },
  },
});

export default slice.reducer;

//==========
// Actions
//==========
export const hentToken = createAction("auth/OPPDATER_TOKENS");
export const sjekkAuth = createAction("auth/KONTROLLER_AUTH");
export const hentetHandling = createAction<string>("auth/HENTET_TOKENS");
export const hentetAuth = createAction<string>("auth/AUTH_RESULTAT");
export const feiletHandling = createAction<string>("auth/FEILET");

//==========
// Epos
//==========
export function hentNyttTokenEpos(
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

export function sjekkAuthEpos(
  action$: ActionsObservable<PayloadAction>,
  state$: StateObservable<RootStateOrAny>,
  { ajax }: Dependencies
) {
  return action$.pipe(
    ofType(sjekkAuth.type),
    mergeMap((action) => {
      return ajax
        .getJSON<{ status: string }>("/internal/isauthenticated")
        .pipe(
          timeout(5000),
          map((response) => response.status)
        )
        .pipe(map((data) => hentetAuth(data)))
        .pipe(
          retryWhen(provIgjenStrategi({ maksForsok: 3 })),
          catchError((error) => {
            return of(feiletHandling(error.message));
          })
        );
    })
  );
}

export const REFRESH_EPICS = [hentNyttTokenEpos, sjekkAuthEpos];
