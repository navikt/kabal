import type { KantKvalitetsvurdering, SelectorWithRegistreringshjemler } from '@/types/kant';

export enum Section {
  OmgjortIKlageomgangen = 'omgjortIKlageomgangen',
  SaksbehandlingsfeilIKlageomgangen = 'saksbehandlingsfeilIKlageomgangen',
}

export const VEDTAKET_BURDE_VAERT_OMGJORT_I_KLAGEOMGANGEN = 'vedtaketBurdeVaertOmgjortIKlageomgangen';

export enum OmgjøringHjemlerField {
  FeilILovtolkningen = 'feilILovtolkningen',
  FeilIFaktagrunnlaget = 'feilIFaktagrunnlaget',
  FeilIRettsanvendelsen = 'feilIRettsanvendelsen',
}

export interface OmgjortIKlageomgangen extends Record<OmgjøringHjemlerField, SelectorWithRegistreringshjemler> {
  [VEDTAKET_BURDE_VAERT_OMGJORT_I_KLAGEOMGANGEN]: boolean | null;
}

export enum SaksbehandlingsfeilField {
  SkulleHaRyddetIDokumenterEllerJournalfoertOpplysninger = 'skulleHaRyddetIDokumenterEllerJournalfoertOpplysninger',
  SkulleHaVeiledetPartenBedre = 'skulleHaVeiledetPartenBedre',
  SkulleHaForhaandsvarsletParten = 'skulleHaForhaandsvarsletParten',
  SkulleHaForelagtOpplysningerForParten = 'skulleHaForelagtOpplysningerForParten',
  SkulleHaUtredetSakenBedre = 'skulleHaUtredetSakenBedre',
  KlagevedtaketSkulleVaertBedreBegrunnet = 'klagevedtaketSkulleVaertBedreBegrunnet',
  SkulleHaBenyttetROL = 'skulleHaBenyttetROL',
}

export type SaksbehandlingsfeilIKlageomgangen = Record<SaksbehandlingsfeilField, boolean>;

export interface KvalitetsvurderingDataAnkeAfter2027 {
  [Section.OmgjortIKlageomgangen]: OmgjortIKlageomgangen;
  [Section.SaksbehandlingsfeilIKlageomgangen]: SaksbehandlingsfeilIKlageomgangen;
}

export interface IKvalitetsvurderingAnkeAfter2027 extends KvalitetsvurderingDataAnkeAfter2027 {
  type: KantKvalitetsvurdering.ANKE_V1;
  created: string;
  modified: string;
}
