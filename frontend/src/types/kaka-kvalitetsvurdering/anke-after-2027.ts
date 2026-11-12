import {
  MainReason,
  OmgjøringBoolean,
  OmgjøringSaksdataHjemlerList,
  SaksbehandlingsfeilBoolean,
  type YesNo,
} from '@/components/kvalitetsvurdering/anke-after-2027/data';
import type { IKvalitetsvurderingBase } from '@/types/kaka-kvalitetsvurdering/common';
import type { KvalitetsvurderingVersion } from '@/types/oppgavebehandling/oppgavebehandling';

interface Omgjøringsårsaker {
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList]: string[];
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: string[];
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: string[];
}

interface Saksbehandlingsfeil {
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet]: boolean;
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet]: boolean;
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet]: boolean;
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet]: boolean;
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet]: boolean;
  [SaksbehandlingsfeilBoolean.klagevedtaketSkulleVærtBedreBegrunnet]: boolean;
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaBenyttetRådgivendeOverlege]: boolean;
}

export interface KvalitetsvurderingDataAnkeAfter2027 extends Omgjøringsårsaker, Saksbehandlingsfeil {
  [MainReason.OmgjøringIKlageomgangen]: YesNo | null;
}

export type KvalitetsvurderingAnkeAfter2027Boolean = Pick<Omgjøringsårsaker, OmgjøringBoolean> & Saksbehandlingsfeil;

export type KvalitetsvurderingAnkeAfter2027SaksdataHjemler = Pick<Omgjøringsårsaker, OmgjøringSaksdataHjemlerList>;

export interface IKvalitetsvurderingAnkeAfter2027 extends KvalitetsvurderingDataAnkeAfter2027, IKvalitetsvurderingBase {
  version: KvalitetsvurderingVersion.ANKE_AFTER_2027;
}
