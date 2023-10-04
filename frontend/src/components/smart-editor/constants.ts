import { TemplateSections } from '@app/plate/types';

export const BOOKMARK_PREFIX = 'bookmark_';
export const COMMENT_PREFIX = 'commentThreadId_';

export const MALTEKST_SECTION_NAMES: Record<TemplateSections, string> = {
  [TemplateSections.TITLE]: 'Dokumenttittel',
  [TemplateSections.INTRODUCTION]: 'Introduksjon',
  [TemplateSections.AVGJOERELSE]: 'Avgjørelse',
  [TemplateSections.KONKLUSJON]: 'Konklusjonen vår',
  [TemplateSections.KLAGER_VEKTLAGT]: 'Klagers anførsler',
  [TemplateSections.VURDERINGEN]: 'Vurderingen vår',
  [TemplateSections.OPPLYSNINGER]: 'Våre vektlagte opplysninger',
  [TemplateSections.ANKEINFO]: 'Ankeinfo',
  [TemplateSections.GENERELL_INFO]: 'Generell informasjon',
  [TemplateSections.SAKSKOSTNADER]: 'Sakskostnader',
  [TemplateSections.REGELVERK]: 'Regelverk',
  [TemplateSections.FREMLEGG]: 'Fremlegg',
  [TemplateSections.TILSVARSRETT]: 'Tilsvarsrett',
  [TemplateSections.VEDLEGG]: 'Vedlegg med forklaring',
  [TemplateSections.SVAR_FRA_ROL]: 'Svar fra ROL',
};
