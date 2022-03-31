import { combineReducers } from 'redux';
import { ansatteApi } from '../redux-api/ansatte';
import { behandlingerApi } from '../redux-api/behandlinger';
import { brukerApi } from '../redux-api/bruker';
import { documentsApi } from '../redux-api/documents';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kabalInternalApi } from '../redux-api/internal';
import { kvalitetsvurderingApi } from '../redux-api/kaka-kvalitetsvurdering';
import { kodeverkApi } from '../redux-api/kodeverk';
import { messagesApi } from '../redux-api/messages';
import { oppgavebehandlingApi } from '../redux-api/oppgavebehandling';
import { oppgaverApi } from '../redux-api/oppgaver';
import { smartEditorApi } from '../redux-api/smart-editor-api';
import { smartEditorCommentsApi } from '../redux-api/smart-editor-comments';
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
  [documentsApi.reducerPath]: documentsApi.reducer,
  [smartEditorCommentsApi.reducerPath]: smartEditorCommentsApi.reducer,
  [behandlingerApi.reducerPath]: behandlingerApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
