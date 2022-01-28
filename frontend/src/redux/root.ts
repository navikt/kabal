import { combineReducers } from 'redux';
import { ansatteApi } from '../redux-api/ansatte';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kabalInternalApi } from '../redux-api/internal';
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
  [kabalInternalApi.reducerPath]: kabalInternalApi.reducer,
  [ansatteApi.reducerPath]: ansatteApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
