import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { RootStateOrAny } from 'react-redux';

//==========
// Type defs
//==========
export interface IOppgaveLaster {
  laster: boolean;
}

//==========
// Reducer
//==========
export const initialState = <IOppgaveLaster>{
  laster: false,
};
export const slice = createSlice({
  name: 'oppgavelaster',
  initialState: initialState,
  reducers: {
    SETT_LASTET: (state, action) => ({
      laster: action.payload,
    }),
  },
});

export default slice.reducer;

//==========
// Actions
//==========
export const { SETT_LASTET } = slice.actions;
export const settOppgaverLaster = createAction('oppgavelaster/SETT_LASTER');
export const settOppgaverFerdigLastet = createAction('oppgavelaster/SETT_FERDIG_LASTET');
