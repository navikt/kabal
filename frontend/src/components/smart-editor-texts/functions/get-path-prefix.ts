import { TextTypes } from '../../../types/texts/texts';

export const getPathPrefix = (textType: TextTypes): string => {
  switch (textType) {
    case TextTypes.MALTEKST:
      return '/maltekster';
    case TextTypes.REDIGERBAR_MALTEKST:
      return '/redigerbare-maltekster';
    case TextTypes.GOD_FORMULERING:
      return '/gode-formuleringer';
    case TextTypes.REGELVERK:
      return '/regelverk';
  }
};
