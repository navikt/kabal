export const ELEMENT_MALTEKST = 'maltekst';
export const ELEMENT_MALTEKSTSEKSJON = 'maltekstseksjon';
export const ELEMENT_CURRENT_DATE = 'current-date';
export const ELEMENT_PAGE_BREAK = 'page-break';
export const ELEMENT_PLACEHOLDER = 'placeholder';
export const ELEMENT_REDIGERBAR_MALTEKST = 'redigerbar-maltekst';
export const ELEMENT_REGELVERK = 'regelverk';
export const ELEMENT_REGELVERK_CONTAINER = 'regelverk-container';
export const ELEMENT_HEADER = 'header';
export const ELEMENT_FOOTER = 'footer';
export const ELEMENT_LABEL_CONTENT = 'label-content';
export const ELEMENT_SIGNATURE = 'signature';
export const ELEMENT_EMPTY_VOID = 'empty-void';

export const UNCHANGEABLE = [
  ELEMENT_HEADER,
  ELEMENT_FOOTER,
  ELEMENT_CURRENT_DATE,
  ELEMENT_SIGNATURE,
  ELEMENT_MALTEKST,
  ELEMENT_LABEL_CONTENT,
  ELEMENT_REGELVERK,
];

export const UNDELETABLE_BUT_REDIGERBAR = [ELEMENT_REDIGERBAR_MALTEKST, ELEMENT_REGELVERK_CONTAINER];
export const UNDELETABLE = [...UNCHANGEABLE, ...UNDELETABLE_BUT_REDIGERBAR, ELEMENT_MALTEKSTSEKSJON];
// eslint-disable-next-line import/no-unused-modules
export const UNINTERACTIONABLE = [ELEMENT_HEADER, ELEMENT_FOOTER, ELEMENT_CURRENT_DATE];
