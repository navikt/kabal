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
  // Klage & Anke & Trygderettsanke
  TRUKKET = '1',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  STADFESTELSE = '6',

  // Klage & Anke
  RETUR = '2',
  UGUNST = '7',

  // Klage & Trygderettsanke
  AVVIST = '8',

  // Trygderettsanke
  HENVISES = '9',
  MEDHOLD_I_TRYGDERETTEN = '10',
  MEDHOLD_I_KLAGEINSTANSEN = '11',
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

export interface IKlageEnhet extends IKodeverkSimpleValue {
  ytelser: IKodeverkSimpleValue[];
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
}
