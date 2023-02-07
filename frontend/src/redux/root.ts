import { combineReducers } from 'redux';
import { accessRightsApi } from '../redux-api/access-rights';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kabalInternalApi } from '../redux-api/internal';
import { journalposterApi } from '../redux-api/journalposter';
import { kvalitetsvurderingV1Api } from '../redux-api/kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '../redux-api/kaka-kvalitetsvurdering/v2';
import { messagesApi } from '../redux-api/messages';
import { oppgaverApi } from '../redux-api/oppgaver/oppgaver';
import { smartEditorCommentsApi } from '../redux-api/smart-editor-comments';
import { textsApi } from '../redux-api/texts';

export const rootReducer = combineReducers({
  [oppgaverApi.reducerPath]: oppgaverApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [featureTogglingApi.reducerPath]: featureTogglingApi.reducer,
  [kvalitetsvurderingV1Api.reducerPath]: kvalitetsvurderingV1Api.reducer,
  [kvalitetsvurderingV2Api.reducerPath]: kvalitetsvurderingV2Api.reducer,
  [kabalInternalApi.reducerPath]: kabalInternalApi.reducer,
  [smartEditorCommentsApi.reducerPath]: smartEditorCommentsApi.reducer,
  [textsApi.reducerPath]: textsApi.reducer,
  [accessRightsApi.reducerPath]: accessRightsApi.reducer,
  [journalposterApi.reducerPath]: journalposterApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
