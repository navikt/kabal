import type { TextTypes } from '@app/types/common-text-types';

export const TEXT_TYPE_BASE_PATH: Record<TextTypes, string> = {
  MALTEKST: 'maltekster',
  REDIGERBAR_MALTEKST: 'redigerbare-maltekster',
  GOD_FORMULERING: 'gode-formuleringer',
  REGELVERK: 'regelverk',
  HEADER: 'topptekster',
  FOOTER: 'bunntekster',
  MALTEKSTSEKSJON: 'maltekstseksjoner',
};
