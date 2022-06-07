import { TemplateSections } from '../../types/texts/texts';
import { Flettefelt } from '../rich-text/types/editor-void-types';

export const COMMENT_PREFIX = 'commentThreadId_';

export const MALTEKST_SECTION_NAMES: Record<TemplateSections, string> = {
  [TemplateSections.TITLE]: 'Dokumenttittel',
  [TemplateSections.INTRODUCTION]: 'Introduksjon',
  [TemplateSections.AVGJOERELSE]: 'Avgjørelse',
  [TemplateSections.KONKLUSJON]: 'Konklusjonen vår',
  [TemplateSections.KLAGER_VEKTLAGT]: 'Klagers anførsler',
  [TemplateSections.VI_VEKTLAGT]: 'Våre vektlagte opplysninger',
  [TemplateSections.VURDERINGEN]: 'Vurderingen vår',
  [TemplateSections.OPPLYSNINGER]: 'Våre vektlagte opplysninger',
  [TemplateSections.ANKEINFO]: 'Ankeinfo',
  [TemplateSections.GENERELL_INFO]: 'Generell informasjon',
  [TemplateSections.SAKSKOSTNADER]: 'Sakskostnader',
  [TemplateSections.REGELVERK]: 'Regelverk',
};

export const FLETTEFELT_NAMES: Record<Flettefelt, string> = {
  [Flettefelt.FNR]: 'Fødselsnummer',
  [Flettefelt.ENHET_NAME]: 'Enhetsnavn',
};
