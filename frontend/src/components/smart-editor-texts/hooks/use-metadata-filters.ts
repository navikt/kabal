import { GOD_FORMULERING_TYPE, PlainTextTypes, REGELVERK_TYPE, TextTypes } from '@app/types/common-text-types';

export const useMetadataFilters = (textType: TextTypes) => ({
  templateSection: textType === GOD_FORMULERING_TYPE,
  ytelseHjemmel: textType === GOD_FORMULERING_TYPE || textType === REGELVERK_TYPE,
  utfall: textType === GOD_FORMULERING_TYPE || textType === REGELVERK_TYPE,
  enhet: textType === PlainTextTypes.HEADER || textType === PlainTextTypes.FOOTER,
});
