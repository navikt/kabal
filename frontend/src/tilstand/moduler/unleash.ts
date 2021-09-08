import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { of } from "rxjs";
import { catchError, map, mergeMap, retryWhen, timeout, withLatestFrom } from "rxjs/operators";
import { provIgjenStrategi } from "../../utility/rxUtils";
import { Dependencies } from "../konfigurerTilstand";

//==========
// Interfaces
//==========
export interface IFeatureToggle {
  navn: string;
  isEnabled: boolean;
}

export interface IFeatureToggles {
  features: [IFeatureToggle?];
}

//==========
// Reducer
//==========
export const unleashSlice = createSlice({
  name: "unleash",
  initialState: {
    features: [],
  } as IFeatureToggles,
  reducers: {
    HENTET: (state, action: PayloadAction<IFeatureToggle>) => {
      if (state.features[action.payload.navn]) {
        state.features[action.payload.navn].isEnabled = action.payload.isEnabled;
      } else {
        state.features.push({
          navn: action.payload.navn,
          isEnabled: action.payload.isEnabled,
        });
      }
      return state;
    },
    FEILET: (state, action: PayloadAction<string>) => {
      console.error(action.payload);
    },
  },
});

export default unleashSlice.reducer;

//==========
// Actions
//==========
export const { HENTET, FEILET } = unleashSlice.actions;
export const hentFeatureToggleHandling = createAction<string>("unleash/HENT_FEATURE");
export const hentetHandling = createAction<IFeatureToggle>("unleash/HENTET");
export const feiletHandling = createAction<string>("unleash/FEILET");

//==========
// Epos
//==========
const featureUrl = (toggleName: string) => `/api/featuretoggle/${toggleName}`;
