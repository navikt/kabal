import {
  GOD_FORMULERING_TYPE,
  MALTEKSTSEKSJON_TYPE,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
  TextTypes,
} from '@app/types/common-text-types';

export const getPathPrefix = (textType: TextTypes): string => {
  switch (textType) {
    case MALTEKSTSEKSJON_TYPE:
      return '/maltekstseksjoner';
    case RichTextTypes.MALTEKST:
      return '/maltekster';
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return '/redigerbare-maltekster';
    case GOD_FORMULERING_TYPE:
      return '/gode-formuleringer';
    case REGELVERK_TYPE:
      return '/regelverk';
    case PlainTextTypes.HEADER:
      return '/topptekster';
    case PlainTextTypes.FOOTER:
      return '/bunntekster';
  }
};
