import { combineReducers } from '@reduxjs/toolkit';
import { accessRightsApi } from '@/redux-api/access-rights';
import { brukerApi } from '@/redux-api/bruker';
import { collaborationApi } from '@/redux-api/collaboration';
import { forlengetBehandlingstidApi } from '@/redux-api/forlenget-behandlingstid';
import { kabalInternalApi } from '@/redux-api/internal';
import { journalposterApi } from '@/redux-api/journalposter';
import { kvalitetsvurderingV1Api } from '@/redux-api/kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '@/redux-api/kaka-kvalitetsvurdering/v2';
import { kvalitetsvurderingV3Api } from '@/redux-api/kaka-kvalitetsvurdering/v3';
import { logiskeVedleggApi } from '@/redux-api/logiske-vedlegg';
import { consumerMaltekstseksjonerApi } from '@/redux-api/maltekstseksjoner/consumer';
import { maltekstseksjonerApi } from '@/redux-api/maltekstseksjoner/maltekstseksjoner';
import { messagesApi } from '@/redux-api/messages';
import { oppgaverApi } from '@/redux-api/oppgaver/oppgaver';
import { searchApi } from '@/redux-api/search';
import { smartEditorCommentsApi } from '@/redux-api/smart-editor-comments';
import { svarbrevApi } from '@/redux-api/svarbrev';
import { consumerTextsApi } from '@/redux-api/texts/consumer';
import { textsApi } from '@/redux-api/texts/texts';

export const rootReducer = combineReducers({
  [oppgaverApi.reducerPath]: oppgaverApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [messagesApi.reducerPath]: messagesApi.reducer,
  [kvalitetsvurderingV1Api.reducerPath]: kvalitetsvurderingV1Api.reducer,
  [kvalitetsvurderingV2Api.reducerPath]: kvalitetsvurderingV2Api.reducer,
  [kvalitetsvurderingV3Api.reducerPath]: kvalitetsvurderingV3Api.reducer,
  [kabalInternalApi.reducerPath]: kabalInternalApi.reducer,
  [smartEditorCommentsApi.reducerPath]: smartEditorCommentsApi.reducer,
  [textsApi.reducerPath]: textsApi.reducer,
  [consumerTextsApi.reducerPath]: consumerTextsApi.reducer,
  [consumerMaltekstseksjonerApi.reducerPath]: consumerMaltekstseksjonerApi.reducer,
  [maltekstseksjonerApi.reducerPath]: maltekstseksjonerApi.reducer,
  [accessRightsApi.reducerPath]: accessRightsApi.reducer,
  [journalposterApi.reducerPath]: journalposterApi.reducer,
  [searchApi.reducerPath]: searchApi.reducer,
  [logiskeVedleggApi.reducerPath]: logiskeVedleggApi.reducer,
  [svarbrevApi.reducerPath]: svarbrevApi.reducer,
  [collaborationApi.reducerPath]: collaborationApi.reducer,
  [forlengetBehandlingstidApi.reducerPath]: forlengetBehandlingstidApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
