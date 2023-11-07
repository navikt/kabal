import { combineReducers } from 'redux';
import { accessRightsApi } from '@app/redux-api/access-rights';
import { brukerApi } from '@app/redux-api/bruker';
import { featureTogglingApi } from '@app/redux-api/feature-toggling';
import { kabalInternalApi } from '@app/redux-api/internal';
import { journalposterApi } from '@app/redux-api/journalposter';
import { kvalitetsvurderingV1Api } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '@app/redux-api/kaka-kvalitetsvurdering/v2';
import { consumerMaltekstseksjonerApi } from '@app/redux-api/maltekstseksjoner/consumer';
import { maltekstseksjonerApi } from '@app/redux-api/maltekstseksjoner/maltekstseksjoner';
import { messagesApi } from '@app/redux-api/messages';
import { oppgaverApi } from '@app/redux-api/oppgaver/oppgaver';
import { smartEditorCommentsApi } from '@app/redux-api/smart-editor-comments';
import { consumerTextsApi } from '@app/redux-api/texts/consumer';
import { textsApi } from '@app/redux-api/texts/texts';

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
  [consumerTextsApi.reducerPath]: consumerTextsApi.reducer,
  [consumerMaltekstseksjonerApi.reducerPath]: consumerMaltekstseksjonerApi.reducer,
  [maltekstseksjonerApi.reducerPath]: maltekstseksjonerApi.reducer,
  [accessRightsApi.reducerPath]: accessRightsApi.reducer,
  [journalposterApi.reducerPath]: journalposterApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
