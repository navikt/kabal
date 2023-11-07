import { MaltekstElement, RedigerbarMaltekstElement } from '@app/plate/types';
import { IMaltekstseksjon } from '@app/types/maltekstseksjoner/responses';

export interface MaltekstseksjonUpdate {
  maltekstseksjon: IMaltekstseksjon;
  children: (MaltekstElement | RedigerbarMaltekstElement)[];
}
