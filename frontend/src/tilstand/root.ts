import { combineReducers } from 'redux';
import klagebehandlinger from './moduler/oppgave';
import meg from './moduler/meg';
import routing from './moduler/router';
import toaster from './moduler/toaster';
import oppgavelaster from './moduler/oppgavelaster';
import featureToggles from './moduler/unleash';
import klagebehandling from './moduler/klagebehandling';
import admin from './moduler/admin';
import sok from './moduler/sok';
import vedtak from './moduler/vedtak';
import { medunderskrivere } from './moduler/medunderskrivere/state';
import kodeverk from './moduler/kodeverk';
import { klagebehandling as klagebehandlingState } from './moduler/klagebehandling/state';
import kvalitetsvurdering from './moduler/kvalitetsvurdering';
import { dokumenter } from './moduler/dokumenter/state';
import { klagebehandlingerApi } from '../redux-api/oppgaver';
import { klagebehandlingApi } from '../redux-api/oppgave';
import { kodeverkApi } from '../redux-api/kodeverk';
import { brukerApi } from '../redux-api/bruker';
import { dokumenterApi } from '../redux-api/dokumenter/api';
import { kvalitetsvurderingApi } from '../redux-api/kvalitetsvurdering';
import { medunderskrivereApi } from '../redux-api/medunderskrivere';

const rootReducer = combineReducers({
  klagebehandlinger,
  meg,
  routing,
  toaster,
  oppgavelaster,
  klagebehandlingState,
  klagebehandling,
  featureToggles,
  admin,
  vedtak,
  medunderskrivere,
  kodeverk,
  dokumenter,
  sok,
  kvalitetsvurdering,
  [klagebehandlingerApi.reducerPath]: klagebehandlingerApi.reducer,
  [kodeverkApi.reducerPath]: kodeverkApi.reducer,
  [brukerApi.reducerPath]: brukerApi.reducer,
  [klagebehandlingApi.reducerPath]: klagebehandlingApi.reducer,
  [dokumenterApi.reducerPath]: dokumenterApi.reducer,
  [kvalitetsvurderingApi.reducerPath]: kvalitetsvurderingApi.reducer,
  [medunderskrivereApi.reducerPath]: medunderskrivereApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
