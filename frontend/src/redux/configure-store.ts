/* eslint-disable import/no-unused-modules */
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { accessRightsApi } from '@app/redux-api/access-rights';
import { brukerApi } from '@app/redux-api/bruker';
import { featureTogglingApi } from '@app/redux-api/feature-toggling';
import { kabalInternalApi } from '@app/redux-api/internal';
import { journalposterApi } from '@app/redux-api/journalposter';
import { kvalitetsvurderingV1Api } from '@app/redux-api/kaka-kvalitetsvurdering/v1';
import { kvalitetsvurderingV2Api } from '@app/redux-api/kaka-kvalitetsvurdering/v2';
import { messagesApi } from '@app/redux-api/messages';
import { oppgaverApi } from '@app/redux-api/oppgaver/oppgaver';
import { smartEditorCommentsApi } from '@app/redux-api/smart-editor-comments';
import { textsApi } from '@app/redux-api/texts';
import { RootState, rootReducer } from './root';

export const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions.
        ignoredActionPaths: [
          'payload.payload.file',
          'payload.file',
          'payload.kvalitetsavvikUtredning',
          'payload.kvalitetsavvikVedtak',
          'payload.kvalitetsavvikOversendelsesbrev',
          'meta.baseQueryMeta.request',
          'meta.baseQueryMeta.response',
          'meta.arg.originalArgs.file',
        ],
      },
    }).concat([
      oppgaverApi.middleware,
      brukerApi.middleware,
      kvalitetsvurderingV1Api.middleware,
      kvalitetsvurderingV2Api.middleware,
      messagesApi.middleware,
      featureTogglingApi.middleware,
      kabalInternalApi.middleware,
      smartEditorCommentsApi.middleware,
      textsApi.middleware,
      accessRightsApi.middleware,
      journalposterApi.middleware,
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
