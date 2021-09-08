import { combineReducers } from "redux";
import klagebehandlinger from "./moduler/oppgave";
import meg from "./moduler/meg";
import routing from "./moduler/router";
import toaster from "./moduler/toaster";
import oppgavelaster from "./moduler/oppgavelaster";
import featureToggles from "./moduler/unleash";
import klagebehandling from "./moduler/klagebehandling";
import admin from "./moduler/admin";
import sok from "./moduler/sok";
import vedtak from "./moduler/vedtak";
import { medunderskrivere } from "./moduler/medunderskrivere/state";
import kodeverk from "./moduler/kodeverk";
import { klagebehandling as klagebehandlingState } from "./moduler/klagebehandling/state";
import kvalitetsvurdering from "./moduler/kvalitetsvurdering";

import { dokumenter } from "./moduler/dokumenter/state";

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
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
