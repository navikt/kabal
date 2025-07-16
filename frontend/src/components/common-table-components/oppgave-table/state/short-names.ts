import { SortFieldEnum, SortOrderEnum } from '@app/types/oppgaver';

export enum ShortParamKey {
  TYPER = 't',
  YTELSER = 'y',
  REGISTRERINGSHJEMLER = 'rh',
  TILDELTE_SAKSBEHANDLERE = 'sb',
  SORTERING = 's',
  HJEMLER = 'h',
  MEDUNDERSKRIVERE = 'mu',
  TILDELTE_ROL = 'rol',
  FERDIGSTILT = 'fin',
  RETURNERT = 'r',
  FRIST = 'f',
  VARSLET_FRIST = 'v',
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
  SHORT_SORT_FIELD_VALUES.some((v) => v === value);

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
  SORT_ORDER_SHORT_VALUES.some((v) => v === value);
