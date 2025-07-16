import { type CommonOppgaverParamsKey, SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

export enum ShortParamKey {
  TYPER = 't',
  YTELSER = 'y',
  REGISTRERINGSHEMLER = 'rh',
  TILDELTE_SAKSBEHANDLERE = 'ts',
  REKKEFOELGE = 'r',
  SORTERING = 's',
  HJEMLER = 'h',
  MEDUNDERSKRIVERE = 'mu',
  TILDELTE_ROL = 'tr',
  FERDIGSTILT_FROM = 'ff',
  RETURNERT_FROM = 'rf',
  FRIST_FROM = 'fr',
  VARSLT_FRIST_FROM = 'vf',
  FERDIGSTILT_TO = 'ft',
  RETURNERT_TO = 'rt',
  FRIST_TO = 'frt',
  VARSLT_FRIST_TO = 'vft',
  // "p" is reserved for page. Used in the usePage() hook.
}

const SHORT_PARAM_KEYS = Object.values(ShortParamKey);

export const isShortParamKey = (value: string): value is ShortParamKey =>
  SHORT_PARAM_KEYS.includes(value as ShortParamKey);

enum ShortSortFieldEnum {
  FRIST = 'f',
  VARSLET_FRIST = 'vf',
  MOTTATT = 'm',
  ALDER = 'a',
  PAA_VENT_FROM = 'pvf',
  PAA_VENT_TO = 'pvt',
  AVSLUTTET_AV_SAKSBEHANDLER = 'as',
  RETURNERT_FRA_ROL = 'rr',
}

export const SORT_FIELD_TO_SHORT: Record<SortFieldEnum, ShortSortFieldEnum> = {
  [SortFieldEnum.FRIST]: ShortSortFieldEnum.FRIST,
  [SortFieldEnum.VARSLET_FRIST]: ShortSortFieldEnum.VARSLET_FRIST,
  [SortFieldEnum.MOTTATT]: ShortSortFieldEnum.MOTTATT,
  [SortFieldEnum.ALDER]: ShortSortFieldEnum.ALDER,
  [SortFieldEnum.PAA_VENT_FROM]: ShortSortFieldEnum.PAA_VENT_FROM,
  [SortFieldEnum.PAA_VENT_TO]: ShortSortFieldEnum.PAA_VENT_TO,
  [SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER]: ShortSortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
  [SortFieldEnum.RETURNERT_FRA_ROL]: ShortSortFieldEnum.RETURNERT_FRA_ROL,
};

export const SHORT_TO_SORT_FIELD: Record<ShortSortFieldEnum, SortFieldEnum> = {
  [ShortSortFieldEnum.FRIST]: SortFieldEnum.FRIST,
  [ShortSortFieldEnum.VARSLET_FRIST]: SortFieldEnum.VARSLET_FRIST,
  [ShortSortFieldEnum.MOTTATT]: SortFieldEnum.MOTTATT,
  [ShortSortFieldEnum.ALDER]: SortFieldEnum.ALDER,
  [ShortSortFieldEnum.PAA_VENT_FROM]: SortFieldEnum.PAA_VENT_FROM,
  [ShortSortFieldEnum.PAA_VENT_TO]: SortFieldEnum.PAA_VENT_TO,
  [ShortSortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER]: SortFieldEnum.AVSLUTTET_AV_SAKSBEHANDLER,
  [ShortSortFieldEnum.RETURNERT_FRA_ROL]: SortFieldEnum.RETURNERT_FRA_ROL,
};

const SHORT_SORT_FIELD_VALUES = Object.values(ShortSortFieldEnum);

export const isShortSortField = (value: string): value is ShortSortFieldEnum =>
  SHORT_SORT_FIELD_VALUES.includes(value as ShortSortFieldEnum);

export const PARAMS_KEY_TO_SHORT: Record<CommonOppgaverParamsKey, ShortParamKey> = {
  typer: ShortParamKey.TYPER,
  ytelser: ShortParamKey.YTELSER,
  registreringshjemler: ShortParamKey.REGISTRERINGSHEMLER,
  tildelteSaksbehandlere: ShortParamKey.TILDELTE_SAKSBEHANDLERE,
  rekkefoelge: ShortParamKey.REKKEFOELGE,
  sortering: ShortParamKey.SORTERING,
  hjemler: ShortParamKey.HJEMLER,
  medunderskrivere: ShortParamKey.MEDUNDERSKRIVERE,
  tildelteRol: ShortParamKey.TILDELTE_ROL,
  ferdigstiltFrom: ShortParamKey.FERDIGSTILT_FROM,
  returnertFrom: ShortParamKey.RETURNERT_FROM,
  fristFrom: ShortParamKey.FRIST_FROM,
  varsletFristFrom: ShortParamKey.VARSLT_FRIST_FROM,
  ferdigstiltTo: ShortParamKey.FERDIGSTILT_TO,
  returnertTo: ShortParamKey.RETURNERT_TO,
  fristTo: ShortParamKey.FRIST_TO,
  varsletFristTo: ShortParamKey.VARSLT_FRIST_TO,
};

const PARAMS_KEY_TO_SHORT_ENTRIES = [...Object.entries(PARAMS_KEY_TO_SHORT)];

export const getParamKeyFromShort = (shortKey: ShortParamKey): CommonOppgaverParamsKey | null => {
  for (const [key, value] of PARAMS_KEY_TO_SHORT_ENTRIES) {
    if (value === shortKey) {
      return key as CommonOppgaverParamsKey;
    }
  }

  return null;
};

enum ShortSortOrderEnum {
  ASC = 'a',
  DESC = 'd',
}

export const SORT_ORDER_TO_SHORT: Record<SortOrderEnum, ShortSortOrderEnum> = {
  [SortOrderEnum.ASC]: ShortSortOrderEnum.ASC,
  [SortOrderEnum.DESC]: ShortSortOrderEnum.DESC,
};

export const SHORT_TO_SORT_ORDER: Record<ShortSortOrderEnum, SortOrderEnum> = {
  [ShortSortOrderEnum.ASC]: SortOrderEnum.ASC,
  [ShortSortOrderEnum.DESC]: SortOrderEnum.DESC,
};

const SORT_ORDER_SHORT_VALUES = Object.values(ShortSortOrderEnum);

export const isShortSortOrder = (value: string): value is ShortSortOrderEnum =>
  SORT_ORDER_SHORT_VALUES.includes(value as ShortSortOrderEnum);
