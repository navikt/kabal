import { TemplateSections } from '@app/plate/template-sections';

export const BOOKMARK_PREFIX = 'bookmark_';
export const COMMENT_PREFIX = 'commentThreadId_';

export const MALTEKST_SECTION_NAMES: Record<TemplateSections, string> = {
  [TemplateSections.TITLE]: 'Dokumenttittel',
  [TemplateSections.INTRODUCTION]: 'Introduksjon (gammel)',
  [TemplateSections.INTRODUCTION_V2]: 'Introduksjon v2',
  [TemplateSections.AVGJOERELSE]: 'Avgjørelse',
  [TemplateSections.ANFOERSLER]: 'Anførsler',
  [TemplateSections.VURDERINGEN]: 'Vurderingen vår',
  [TemplateSections.OPPLYSNINGER]: 'Vektlagte dokumenter',
  [TemplateSections.ANKEINFO]: 'Ankeinfo',
  [TemplateSections.GENERELL_INFO]: 'Generell informasjon',
  [TemplateSections.SAKSKOSTNADER]: 'Sakskostnader',
  [TemplateSections.REGELVERK_TITLE]: 'Regelverktittel',
  [TemplateSections.FREMLEGG]: 'Fremlegg',
  [TemplateSections.TILSVARSRETT]: 'Tilsvarsrett (gammel)',
  [TemplateSections.TILSVARSRETT_V2]: 'Tilsvarsrett v2',
  [TemplateSections.VEDLEGG]: 'Vedlegg med forklaring',
  [TemplateSections.SVAR_FRA_ROL]: 'Svar fra ROL',
  [TemplateSections.TILSVARSBREV_TITLE]: 'Tilsvarsbrevtittel',
  [TemplateSections.SAKSGANG]: 'Saksgang',

  [TemplateSections.INTRODUCTION_TEMP]: 'Introduksjon (midlertidig)',
};
