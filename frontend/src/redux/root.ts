import { combineReducers } from 'redux';
import { adminApi } from '../redux-api/admin';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kvalitetsvurderingApi } from '../redux-api/kaka-kvalitetsvurdering';
import { kodeverkApi } from '../redux-api/kodeverk';
import { messagesApi } from '../redux-api/messages';
import { oppgavebehandlingApi } from '../redux-api/oppgavebehandling';
import { oppgaverApi } from '../redux-api/oppgaver';
import { smartEditorApi } from '../redux-api/smart-editor';
import { smartEditorIdApi } from '../redux-api/smart-editor-id';

export const rootReducer = combineReducers({
  [oppgaverApi.reducerPath]: oppgaverApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [oppgavebehandlingApi.reducerPath]: oppgavebehandlingApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [featureTogglingApi.reducerPath]: featureTogglingApi.reducer,
  [smartEditorApi.reducerPath]: smartEditorApi.reducer,
  [smartEditorIdApi.reducerPath]: smartEditorIdApi.reducer,
  [kvalitetsvurderingApi.reducerPath]: kvalitetsvurderingApi.reducer,
  [adminApi.reducerPath]: adminApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
