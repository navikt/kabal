import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { errorToastMiddleware } from '@/redux/error-toast-middleware';
import { type RootState, rootReducer } from '@/redux/root';
import { setStoreRef } from '@/redux/store-ref';
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

export const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat([
      oppgaverApi.middleware,
      brukerApi.middleware,
      kvalitetsvurderingV1Api.middleware,
      kvalitetsvurderingV2Api.middleware,
      kvalitetsvurderingV3Api.middleware,
      messagesApi.middleware,
      kabalInternalApi.middleware,
      smartEditorCommentsApi.middleware,
      textsApi.middleware,
      consumerTextsApi.middleware,
      maltekstseksjonerApi.middleware,
      consumerMaltekstseksjonerApi.middleware,
      accessRightsApi.middleware,
      journalposterApi.middleware,
      searchApi.middleware,
      logiskeVedleggApi.middleware,
      svarbrevApi.middleware,
      collaborationApi.middleware,
      forlengetBehandlingstidApi.middleware,
      errorToastMiddleware,
    ]),
});

setStoreRef(reduxStore);

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
