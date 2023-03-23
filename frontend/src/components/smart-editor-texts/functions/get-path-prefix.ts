import { PlainTextTypes, RichTextTypes, TextTypes } from '@app/types/texts/texts';

export const getPathPrefix = (textType: TextTypes): string => {
  switch (textType) {
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
