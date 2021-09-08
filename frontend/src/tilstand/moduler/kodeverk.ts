import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { of } from 'rxjs';
import { catchError, map, retryWhen, switchMap, timeout } from 'rxjs/operators';
import { provIgjenStrategi } from '../../utility/rxUtils';
import { GrunnerPerUtfall } from './klagebehandling';
import { AppDispatch, Dependencies } from '../konfigurerTilstand';
import { RootState } from '../root';

export interface IKodeverkVerdi {
  id: string;
  navn: string;
  beskrivelse: string;
}

export interface IKodeverkVerdiMedHjemler {
  hjemler: IKodeverkVerdi[];
  temaId: string;
}

export interface IKodeverk {
  hjemmel: IKodeverkVerdi[];
  type: IKodeverkVerdi[];
  utfall: IKodeverkVerdi[];
  grunn: IKodeverkVerdi[];
  grunnerPerUtfall: GrunnerPerUtfall[];
  hjemlerPerTema: IKodeverkVerdiMedHjemler[];
  hjemler: IKodeverkVerdi[];
  tema: IKodeverkVerdi[];
  kvalitetsavvikUtredning: IKodeverkVerdi[];
  kvalitetsavvikOversendelsesbrev: IKodeverkVerdi[];
  kvalitetsavvikVedtak: IKodeverkVerdi[];
}

export type IKodeverkState = {
  lasterKodeverk: boolean;
  kodeverk: IKodeverk;
};

//==========
// Reducer
//==========

const initialState: IKodeverkState = {
  lasterKodeverk: true,
  kodeverk: {
    utfall: [],
    hjemler: [],
    hjemlerPerTema: [],
    hjemmel: [],
    type: [],
    tema: [],
    grunn: [],
    grunnerPerUtfall: [],
    kvalitetsavvikUtredning: [],
    kvalitetsavvikOversendelsesbrev: [],
    kvalitetsavvikVedtak: [],
  },
};

export const kodeverkSlice = createSlice({
  name: 'kodeverk',
  initialState,
  reducers: {
    showLoading: (state) => {
      state.lasterKodeverk = true;
      return state;
    },
    hideLoading: (state) => {
      state.lasterKodeverk = false;
      return state;
    },
    setKodeverk: (state, action: PayloadAction<IKodeverk>) => {
      state.kodeverk = action.payload;
      state.lasterKodeverk = false;
      return state;
    },
    failed: (state, action: PayloadAction<string>) => {
      state.lasterKodeverk = false;
      return state;
    },
  },
});

export default kodeverkSlice.reducer;

//==========
// Actions
//==========
export const { showLoading, hideLoading, setKodeverk } = kodeverkSlice.actions;

export const loadKodeverk = () => async (dispatch: AppDispatch) => {
  dispatch(showLoading());
  const res = await fetch('/api/kodeverk');
  const kodeverk: IKodeverk = await res.json();
  dispatch(setKodeverk(kodeverk));
  dispatch(hideLoading());
};
