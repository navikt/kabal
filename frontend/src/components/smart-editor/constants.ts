import { TemplateSections } from '@app/plate/template-sections';

export const BOOKMARK_PREFIX = 'bookmark_';
export const COMMENT_PREFIX = 'commentThreadId_';

export const MALTEKST_SECTION_NAMES: Record<TemplateSections, string> = {
  [TemplateSections.TITLE]: 'Dokumenttittel',
  [TemplateSections.INTRODUCTION_V1]: 'Introduksjon (gammel)',
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
  [TemplateSections.TILSVARSRETT_V1]: 'Tilsvarsrett v1 (gammel)',
  [TemplateSections.TILSVARSRETT_V2]: 'Tilsvarsrett v2 (gammel)',
  [TemplateSections.TILSVARSRETT_V3]: 'Tilsvarsrett v3',
  [TemplateSections.VEDLEGG]: 'Vedlegg med forklaring',
  [TemplateSections.SVAR_FRA_ROL]: 'Svar fra ROL',
  [TemplateSections.TILSVARSBREV_TITLE]: 'Tilsvarsbrevtittel',
  [TemplateSections.SAKSGANG]: 'Saksgang',
  [TemplateSections.SVAR_PÅ_INNSYNSBEGJÆRING]: 'Svar på innsynsbegjæring',
  [TemplateSections.OM_TAUSHETSPLIKT]: 'Om taushetsplikt',
  [TemplateSections.OM_REGELVERK]: 'Om regelverket i saken',
  [TemplateSections.HVORFOR_OMGJØRING]: 'Om hvorfor omgjøring vurderes',

  [TemplateSections.INTRODUCTION_TEMP]: 'Introduksjon (midlertidig)',
};
