import { IDokument } from './state-types';

export interface IDokumentParams {
  id: string;
  idx: number;
  handling: string;
  antall: number;
  ref: string | null;
  historyNavigate: boolean;
}

export interface IDokumenterRespons {
  dokumenter: IDokument[];
  pageReference: string | null;
  antall: number;
  totaltAntall: number;
}

export interface IDokumenterParams {
  klagebehandlingId: string;
  pageReference: string | null;
  temaFilter: string[] | undefined;
}
