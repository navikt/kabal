import type { MaltekstElement, RedigerbarMaltekstElement } from '@app/plate/types';
import type { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

export interface MaltekstseksjonUpdate {
  maltekstseksjon: IMaltekstseksjon;
  children: (MaltekstElement | RedigerbarMaltekstElement)[];
}
