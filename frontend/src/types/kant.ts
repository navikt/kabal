export enum KantKvalitetsvurdering {
  ANKE_V1 = 'ANKE_V1',
  ANKE_ITR_V1 = 'ANKE_ITR_AFTER_2027',
}

export const REGISTRERINGSHJEMLER = 'registreringshjemler';

export interface SelectorWithRegistreringshjemler {
  selected: boolean;
  [REGISTRERINGSHJEMLER]: string[];
}
