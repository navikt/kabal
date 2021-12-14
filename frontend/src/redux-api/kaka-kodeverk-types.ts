export interface IKakaKodeverkValue<T extends string = string> {
  id: T;
  navn: string;
  beskrivelse: string;
}

export interface ITema extends IKakaKodeverkValue {
  hjemler: IKakaKodeverkValue[];
  enheter: IKakaKodeverkValue[];
}

export interface IKakaKodeverk {
  temaer: ITema[];
  utfall: IKakaKodeverkValue<UtfallEnum>[];
  sakstyper: IKakaKodeverkValue<SakstypeEnum>[];
  partIdTyper: IKakaKodeverkValue<PartEnum>[];
  hjemler: IKakaKodeverkValue[];
  ytelser: IKakaKodeverkValue[];
}

export enum PartEnum {
  PERSON = 'PERSON',
  VIRKSOMHET = 'VIRKSOMHET',
}

export const isPart = (s: string): s is PartEnum => Object.values(PartEnum).some((e) => e === s);

export enum SakstypeEnum {
  KLAGE = '1',
  ANKE = '2',
}

export const isSakstype = (s: string): s is SakstypeEnum => Object.values(SakstypeEnum).some((e) => e === s);

export enum UtfallEnum {
  AVVIST = '8',
  DELVIS_MEDHOLD = '5',
  MEDHOLD = '4',
  OPPHEVET = '3',
  OPPRETTHOLDT = '6',
  RETUR = '2',
  TRUKKET = '1',
  UGUNST = '7',
}

export const isUtfall = (s: string): s is UtfallEnum => Object.values(UtfallEnum).some((e) => e === s);
