import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { brukerApi } from '../redux-api/bruker';
import { featureTogglingApi } from '../redux-api/feature-toggling';
import { kodeverkApi } from '../redux-api/kodeverk';
import { kvalitetsvurderingApi } from '../redux-api/kvalitetsvurdering';
import { messagesApi } from '../redux-api/messages';
import { klagebehandlingApi } from '../redux-api/oppgave';
import { klagebehandlingerApi } from '../redux-api/oppgaver';
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
        ],
      },
    }).concat([
      klagebehandlingerApi.middleware,
      kodeverkApi.middleware,
      brukerApi.middleware,
      klagebehandlingApi.middleware,
      kvalitetsvurderingApi.middleware,
      messagesApi.middleware,
      featureTogglingApi.middleware,
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
