import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
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

//==========
// Actions
//==========
export const hentToken = createAction("auth/OPPDATER_TOKENS");
export const sjekkAuth = createAction("auth/KONTROLLER_AUTH");
export const hentetHandling = createAction<string>("auth/HENTET_TOKENS");
export const hentetAuth = createAction<string>("auth/AUTH_RESULTAT");
export const feiletHandling = createAction<string>("auth/FEILET");
