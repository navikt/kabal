import { PlainTextTypes, RichTextTypes, TextTypes } from '@app/types/common-text-types';

export const getPathPrefix = (textType: TextTypes): string => {
  switch (textType) {
    case RichTextTypes.MALTEKSTSEKSJON:
      return '/maltekstseksjoner';
    case RichTextTypes.MALTEKST:
      return '/maltekster';
    case RichTextTypes.REDIGERBAR_MALTEKST:
      return '/redigerbare-maltekster';
    case RichTextTypes.GOD_FORMULERING:
      return '/gode-formuleringer';
    case RichTextTypes.REGELVERK:
      return '/regelverk';
    case PlainTextTypes.HEADER:
      return '/topptekster';
    case PlainTextTypes.FOOTER:
      return '/bunntekster';
  }
};
