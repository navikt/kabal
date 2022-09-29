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
  KLAGE = '1',
  ANKE = '2',
  ANKE_I_TRYGDERETTEN = '3',
}

export enum Utfall {
  TRUKKET = '1',
  RETUR = '2',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  STADFESTELSE = '6',
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

export interface IYtelse extends IKodeverkSimpleValue {
  lovKildeToRegistreringshjemler: ILovKildeToRegistreringshjemmel[];
  innsendingshjemler: IKodeverkValue[];
}

interface IKlageEnhet extends IKodeverkSimpleValue {
  ytelser: IKodeverkSimpleValue[];
}

interface ISakstyperToUtfall extends IKodeverkSimpleValue<OppgaveType> {
  utfall: IKodeverkSimpleValue<Utfall>[];
}

export interface IKodeverk {
  enheter: IKodeverkSimpleValue[];
  hjemler: IKodeverkValue[];
  klageenheter: IKlageEnhet[];
  sakstyper: IKodeverkSimpleValue<OppgaveType>[];
  sources: IKodeverkSimpleValue[];
  styringsenheter: IKodeverkSimpleValue[];
  tema: IKodeverkValue[];
  utfall: IKodeverkSimpleValue<Utfall>[];
  vedtaksenheter: IKodeverkSimpleValue[];
  ytelser: IYtelse[];
  sakstyperToUtfall: ISakstyperToUtfall[];
}
