export enum Gender {
  MALE = 'MANN',
  FEMALE = 'KVINNE',
}

export enum MedunderskriverFlyt {
  IKKE_SENDT = 'IKKE_SENDT',
  OVERSENDT_TIL_MEDUNDERSKRIVER = 'OVERSENDT_TIL_MEDUNDERSKRIVER',
  RETURNERT_TIL_SAKSBEHANDLER = 'RETURNERT_TIL_SAKSBEHANDLER',
}

export enum OppgaveType {
  KLAGEBEHANDLING = '1',
  ANKEBEHANDLING = '2',
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

export interface IKodeverkSimpleValue<T extends string = string> {
  id: T;
  navn: string;
}

export interface IKodeverkValue<T extends string = string> extends IKodeverkSimpleValue<T> {
  beskrivelse: string;
}

export interface ILovKildeToRegistreringshjemmel {
  lovkilde: IKodeverkValue;
  registreringshjemler: IKodeverkSimpleValue[];
}

export interface IYtelse extends IKodeverkValue {
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemmel[];
}

export interface IKlageEnhet extends IKodeverkValue {
  ytelser: IKodeverkValue[];
}

export interface IKodeverk {
  ytelser: IYtelse[];
  tema: IKodeverkValue[];
  hjemler: IKodeverkValue[];
  enheter: IKodeverkValue[];
  klageenheter: IKlageEnhet[];
  sakstyper: IKodeverkSimpleValue<OppgaveType>[];
  utfall: IKodeverkSimpleValue<Utfall>[];
  sources: IKodeverkSimpleValue[];
}