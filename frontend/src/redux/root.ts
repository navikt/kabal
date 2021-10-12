import { combineReducers } from 'redux';
import { brukerApi } from '../redux-api/bruker';
import { dokumenterApi } from '../redux-api/dokumenter/api';
import { kodeverkApi } from '../redux-api/kodeverk';
import { kvalitetsvurderingApi } from '../redux-api/kvalitetsvurdering';
import { messagesApi } from '../redux-api/messages';
import { klagebehandlingApi } from '../redux-api/oppgave';
import { klagebehandlingerApi } from '../redux-api/oppgaver';

export const rootReducer = combineReducers({
  [klagebehandlingerApi.reducerPath]: klagebehandlingerApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [klagebehandlingApi.reducerPath]: klagebehandlingApi.reducer,
  [dokumenterApi.reducerPath]: dokumenterApi.reducer,
  [kvalitetsvurderingApi.reducerPath]: kvalitetsvurderingApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
