export enum SexEnum {
  MALE = 'MANN',
  FEMALE = 'KVINNE',
  UNKNOWN = 'UKJENT',
}

export enum MedunderskriverFlyt {
  IKKE_SENDT = 'IKKE_SENDT',
  OVERSENDT_TIL_MEDUNDERSKRIVER = 'OVERSENDT_TIL_MEDUNDERSKRIVER',
  RETURNERT_TIL_SAKSBEHANDLER = 'RETURNERT_TIL_SAKSBEHANDLER',
}

export const isMedunderskriverFlyt = (value: string): value is MedunderskriverFlyt =>
  value === MedunderskriverFlyt.IKKE_SENDT ||
  value === MedunderskriverFlyt.OVERSENDT_TIL_MEDUNDERSKRIVER ||
  value === MedunderskriverFlyt.RETURNERT_TIL_SAKSBEHANDLER;

export enum SaksTypeEnum {
  KLAGE = '1',
  ANKE = '2',
  ANKE_I_TRYGDERETTEN = '3',
}

export enum UtfallEnum {
  TRUKKET = '1',
  RETUR = '2',
  OPPHEVET = '3',
  MEDHOLD = '4',
  DELVIS_MEDHOLD = '5',
  STADFESTELSE = '6',
  UGUNST = '7',
  AVVIST = '8',
  INNSTILLING_STADFESTELSE = '9',
  INNSTILLING_AVVIST = '10',
  HEVET = '11',
  HENVIST = '12',
}

export const isUtfallId = (value: string): value is UtfallEnum =>
  value === UtfallEnum.TRUKKET ||
  value === UtfallEnum.RETUR ||
  value === UtfallEnum.OPPHEVET ||
  value === UtfallEnum.MEDHOLD ||
  value === UtfallEnum.DELVIS_MEDHOLD ||
  value === UtfallEnum.STADFESTELSE ||
  value === UtfallEnum.UGUNST ||
  value === UtfallEnum.AVVIST ||
  value === UtfallEnum.INNSTILLING_STADFESTELSE ||
  value === UtfallEnum.INNSTILLING_AVVIST ||
  value === UtfallEnum.HEVET ||
  value === UtfallEnum.HENVIST;

export enum Brevmottakertype {
  KLAGER = '1',
  SAKEN_GJELDER = '2',
  PROSESSFULLMEKTIG = '3',
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

export interface IKlageenhet extends IKodeverkSimpleValue {
  ytelser: IKodeverkSimpleValue[];
}

export interface ISakstyperToUtfall extends IKodeverkSimpleValue<SaksTypeEnum> {
  utfall: IKodeverkSimpleValue<UtfallEnum>[];
}

export interface IKodeverk {
  enheter: IKodeverkSimpleValue[];
  hjemler: IKodeverkValue[];
  klageenheter: IKlageenhet[];
  sakstyper: IKodeverkSimpleValue<SaksTypeEnum>[];
  sources: IKodeverkSimpleValue[];
  styringsenheter: IKodeverkSimpleValue[];
  tema: IKodeverkValue[];
  utfall: IKodeverkSimpleValue<UtfallEnum>[];
  vedtaksenheter: IKodeverkSimpleValue[];
  ytelser: IYtelse[];
  sakstyperToUtfall: ISakstyperToUtfall[];
  brevmottakertyper: IKodeverkSimpleValue<Brevmottakertype>[];
}
