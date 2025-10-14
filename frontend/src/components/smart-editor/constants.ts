import { DeprecatedTemplateSections, TemplateSections } from '@app/plate/template-sections';

export const BOOKMARK_PREFIX = 'bookmark_';
export const COMMENT_PREFIX = 'commentThreadId_';

export const MALTEKST_SECTION_NAMES: Record<TemplateSections | DeprecatedTemplateSections, string> = {
  [TemplateSections.TITLE]: 'Dokumenttittel',
  [DeprecatedTemplateSections.INTRODUCTION_V1]: 'Introduksjon v1',
  [TemplateSections.INTRODUCTION_V2]: 'Introduksjon',
  [TemplateSections.AVGJOERELSE]: 'Avgjørelse',
  [TemplateSections.ANFOERSLER]: 'Anførsler',
  [TemplateSections.VURDERINGEN]: 'Begrunnelsen vår',
  [TemplateSections.OPPLYSNINGER]: 'Vektlagte dokumenter',
  [TemplateSections.ANKEINFO]: 'Ankeinfo',
  [TemplateSections.GENERELL_INFO]: 'Generell informasjon',
  [TemplateSections.SAKSKOSTNADER]: 'Sakskostnader',
  [TemplateSections.REGELVERK_TITLE]: 'Regelverktittel',
  [TemplateSections.FREMLEGG]: 'Fremlegg',
  [DeprecatedTemplateSections.TILSVARSRETT_V1]: 'Tilsvarsrett v1',
  [DeprecatedTemplateSections.TILSVARSRETT_V2]: 'Tilsvarsrett v2',
  [TemplateSections.TILSVARSRETT_V3]: 'Tilsvarsrett',
  [TemplateSections.VEDLEGG]: 'Vedlegg med forklaring',
  [TemplateSections.SVAR_FRA_ROL]: 'Svar fra ROL',
  [TemplateSections.TILSVARSBREV_TITLE]: 'Tilsvarsbrevtittel',
  [TemplateSections.SAKSGANG]: 'Saksgang',
  [TemplateSections.SVAR_PÅ_INNSYNSBEGJÆRING]: 'Svar på innsynsbegjæring',
  [TemplateSections.OM_TAUSHETSPLIKT]: 'Om taushetsplikt',
  [TemplateSections.OM_REGELVERK]: 'Om regelverket i saken',
  [TemplateSections.HVORFOR_OMGJØRING]: 'Om hvorfor omgjøring vurderes',
  [TemplateSections.OM_ANKENDE_PARTS_TILSVAR]: 'Om ankende parts tilsvar',
  [TemplateSections.OM_VEDLAGTE_DOKUMENTER]: 'Om vedlagte dokumenter',
  [TemplateSections.OM_ETTERSENDING_TIL_TR]: 'Om ettersending til Trygderetten',

  [TemplateSections.INTRODUCTION_TEMP]: 'Introduksjon (midlertidig)',
};
