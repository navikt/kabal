import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kabalInternalApi } from '../redux-api/internal';
import { kvalitetsvurderingApi } from '../redux-api/kaka-kvalitetsvurdering';
import { kodeverkApi } from '../redux-api/kodeverk';
import { messagesApi } from '../redux-api/messages';
import { oppgaverApi } from '../redux-api/oppgaver/oppgaver';
import { smartEditorCommentsApi } from '../redux-api/smart-editor-comments';
import { textsApi } from '../redux-api/texts';
import { RootState, rootReducer } from './root';

export const reduxStore = configureStore({
  reducer: rootReducer,
  devTools: true,
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
      kodeverkApi.middleware,
      brukerApi.middleware,
      kvalitetsvurderingApi.middleware,
      messagesApi.middleware,
      featureTogglingApi.middleware,
      kabalInternalApi.middleware,
      smartEditorCommentsApi.middleware,
      textsApi.middleware,
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
