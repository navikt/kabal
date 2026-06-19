import { GOD_FORMULERING_TYPE, REGELVERK_TYPE, type TextTypes } from '@/types/common-text-types';

export const useMetadataFilters = (textType: TextTypes) => ({
  hasTemplateSectionFilter: textType === GOD_FORMULERING_TYPE,
  hasYtelseHjemmelFilter: textType === GOD_FORMULERING_TYPE || textType === REGELVERK_TYPE,
  hasUtfallFilter: textType === GOD_FORMULERING_TYPE || textType === REGELVERK_TYPE,
});
