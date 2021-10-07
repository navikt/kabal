import { configureStore } from '@reduxjs/toolkit';
import reducer, { RootState } from './root';
import { ajax } from 'rxjs/ajax';
import { fromFetch } from 'rxjs/fetch';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { klagebehandlingerApi } from '../redux-api/oppgaver';
import { kodeverkApi } from '../redux-api/kodeverk';
import { brukerApi } from '../redux-api/bruker';
import { klagebehandlingApi } from '../redux-api/oppgave';
import { dokumenterApi } from '../redux-api/dokumenter/api';
import { kvalitetsvurderingApi } from '../redux-api/kvalitetsvurdering';
import { messagesApi } from '../redux-api/messages';

const dependencies = {
  ajax,
  fromFetch,
};

export type Dependencies = typeof dependencies;

const reduxStore = configureStore({
  reducer,
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
      dokumenterApi.middleware,
      kvalitetsvurderingApi.middleware,
      messagesApi.middleware
    ]),
});

export type AppDispatch = typeof reduxStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default reduxStore;
