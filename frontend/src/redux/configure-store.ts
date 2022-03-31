import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
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
      oppgavebehandlingApi.middleware,
      kvalitetsvurderingApi.middleware,
      messagesApi.middleware,
      featureTogglingApi.middleware,
      smartEditorApi.middleware,
      smartEditorIdApi.middleware,
      kabalInternalApi.middleware,
      ansatteApi.middleware,
      documentsApi.middleware,
      smartEditorCommentsApi.middleware,
      behandlingerApi.middleware,
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
