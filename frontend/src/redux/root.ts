import { combineReducers } from 'redux';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kabalInternalApi } from '../redux-api/internal';
import { kvalitetsvurderingApi } from '../redux-api/kaka-kvalitetsvurdering';
import { kodeverkApi } from '../redux-api/kodeverk';
import { messagesApi } from '../redux-api/messages';
import { oppgaverApi } from '../redux-api/oppgaver/oppgaver';
import { smartEditorCommentsApi } from '../redux-api/smart-editor-comments';
import { textsApi } from '../redux-api/texts';

export const rootReducer = combineReducers({
  [oppgaverApi.reducerPath]: oppgaverApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [featureTogglingApi.reducerPath]: featureTogglingApi.reducer,
  [kvalitetsvurderingApi.reducerPath]: kvalitetsvurderingApi.reducer,
  [kabalInternalApi.reducerPath]: kabalInternalApi.reducer,
  [smartEditorCommentsApi.reducerPath]: smartEditorCommentsApi.reducer,
  [textsApi.reducerPath]: textsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
