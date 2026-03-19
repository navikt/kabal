import type { MaltekstElement, RedigerbarMaltekstElement } from '@/plate/types';
import type { IMaltekstseksjon } from '@/types/maltekstseksjoner/responses';

export interface MaltekstseksjonUpdate {
  maltekstseksjon: IMaltekstseksjon;
  children: (MaltekstElement | RedigerbarMaltekstElement)[];
}
