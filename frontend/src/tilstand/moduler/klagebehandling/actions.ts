import { createAction } from "@reduxjs/toolkit";
import { IKlagebehandlingOppdatering } from "./types";

export const lagreKlagebehandling =
  createAction<IKlagebehandlingOppdatering>("klagebehandling/LAGRE");
export const hentKlagebehandling = createAction<string>("klagebehandling/HENT");
export const settKlageVersjon = createAction<number>("klagebehandling/SETT_VERSJON");
export const settOpptatt = createAction("klagebehandling/OPPTATT");
export const settLedig = createAction("klagebehandling/LEDIG");

export const unloadKlagebehandling = createAction("klagebehandling/UNLOAD");
