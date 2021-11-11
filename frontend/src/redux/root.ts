import { combineReducers } from 'redux';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kakaKodeverkApi } from '../redux-api/kaka-kodeverk';
import { kvalitetsvurderingApi } from '../redux-api/kaka-kvalitetsvurdering';
import { kodeverkApi } from '../redux-api/kodeverk';
import { messagesApi } from '../redux-api/messages';
import { klagebehandlingApi } from '../redux-api/oppgave';
import { klagebehandlingerApi } from '../redux-api/oppgaver';
import { smartEditorApi } from '../redux-api/smart-editor';
import { smartEditorIdApi } from '../redux-api/smart-editor-id';

export const rootReducer = combineReducers({
  [klagebehandlingerApi.reducerPath]: klagebehandlingerApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [klagebehandlingApi.reducerPath]: klagebehandlingApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [featureTogglingApi.reducerPath]: featureTogglingApi.reducer,
  [smartEditorApi.reducerPath]: smartEditorApi.reducer,
  [smartEditorIdApi.reducerPath]: smartEditorIdApi.reducer,
  [kvalitetsvurderingApi.reducerPath]: kvalitetsvurderingApi.reducer,
  [kakaKodeverkApi.reducerPath]: kakaKodeverkApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
