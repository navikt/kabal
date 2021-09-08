import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';
import { catchError, map, retryWhen, switchMap } from 'rxjs/operators';
import { concat } from 'rxjs';
import { toasterSett, toasterSkjul } from './toaster';
import { provIgjenStrategi } from '../../utility/rxUtils';
import { Dependencies } from '../konfigurerTilstand';

//==========
// Interfaces
//==========

//==========
// Reducer
//==========
export const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    laster: false,
    response: '',
  },
  reducers: {
    GJENBYGG_ELASTIC: (state, action: PayloadAction) => {
      state.laster = true;
      return state;
    },
    ELASTIC_FAIL: (state, action: PayloadAction) => {
      state.laster = false;
      return state;
    },
    ELASTIC_RESPONSE: (state, action: PayloadAction<any>) => {
      state.laster = false;
      state.response = action.payload.status === 200 ? 'suksess' : 'feil';
      return state;
    },
  },
});

export default adminSlice.reducer;

//==========
// Actions
//==========
export const gjenbyggElasticHandling = createAction('admin/GJENBYGG_ELASTIC');
export const stoppLasting = createAction('admin/ELASTIC_FAIL');
export const elasticResponse = createAction<any>('admin/ELASTIC_RESPONSE');
