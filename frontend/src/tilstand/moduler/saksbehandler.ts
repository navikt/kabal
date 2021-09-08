import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootStateOrAny } from "react-redux";
import { concat, of } from "rxjs";
import { catchError, mergeMap, switchMap, timeout, withLatestFrom } from "rxjs/operators";
import { OppgaveParams, oppgaveRequest } from "./oppgave";
import { settOppgaverFerdigLastet, settOppgaverLaster } from "./oppgavelaster";
import { displayToast, skjulToaster } from "./meg";
import { Dependencies } from "../konfigurerTilstand";

//==========
// Type defs
//==========
export type TildelType = {
  id: string;
  klagebehandlingVersjon: number;
  saksbehandler: {
    navn: string;
    ident: string;
  };
};
export type ITildelOppgave = {
  ident: string;
  oppgaveId: string;
  klagebehandlingVersjon: number;
  enhetId: string;
  kjorOppgavesokVedSuksess: boolean;
};

//==========
// Actions
//==========
export const tildelMegHandling = createAction<ITildelOppgave>("saksbehandler/TILDEL_MEG");
export const fradelMegHandling = createAction<ITildelOppgave>("saksbehandler/FRADEL_MEG");
