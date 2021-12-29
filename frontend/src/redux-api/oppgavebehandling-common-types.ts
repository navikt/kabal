export enum OppgaveType {
  KLAGEBEHANDLING = '1',
  ANKEBEHANDLING = '2',
}

export enum Gender {
  MALE = 'MANN',
  FEMALE = 'KVINNE',
}

export interface IDocumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface ISaksbehandler {
  navIdent: string;
  navn: string;
}

export interface IMedunderskriver {
  ident: string;
  navn: string;
}

export interface IVedlegg {
  name: string;
  size: number;
  opplastet: string | null; // LocalDateTime
}

export enum Utfall {
  TRUKKET = '1',
  RETUR = '2',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  OPPRETTHOLDT = '6',
  UGUNST = '7',
  AVVIST = '8',
}

export enum MedunderskriverFlyt {
  IKKE_SENDT = 'IKKE_SENDT',
  OVERSENDT_TIL_MEDUNDERSKRIVER = 'OVERSENDT_TIL_MEDUNDERSKRIVER',
  RETURNERT_TIL_SAKSBEHANDLER = 'RETURNERT_TIL_SAKSBEHANDLER',
}
