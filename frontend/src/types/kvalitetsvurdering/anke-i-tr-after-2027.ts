import type { KyndigeMedlemmer, RettensSammensetning } from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import type { KantKvalitetsvurdering, SelectorWithRegistreringshjemler } from '@/types/kant';

export enum Section {
  OmgjortIAnkeomgangen = 'omgjortIAnkeomgangen',
  RettensSammensetning = 'rettensSammensetning',
  KjennelsensBetydningOgLaeringsverdi = 'kjennelsensBetydningOgLaeringsverdi',
}

export const VEDTAKET_BURDE_VAERT_OMGJORT_I_ANKEOMGANGEN = 'vedtaketBurdeVaertOmgjortIAnkeomgangen';

export enum OmgjøringHjemlerField {
  FeilILovtolkningen = 'feilILovtolkningen',
  FeilIFaktagrunnlaget = 'feilIFaktagrunnlaget',
  FeilIRettsanvendelsen = 'feilIRettsanvendelsen',
}

export interface OmgjortIAnkeomgangen extends Record<OmgjøringHjemlerField, SelectorWithRegistreringshjemler> {
  [VEDTAKET_BURDE_VAERT_OMGJORT_I_ANKEOMGANGEN]: boolean | null;
}

export enum RettensSammensetningField {
  RettensSammensetning = 'rettensSammensetning',
  AttfoeringskyndigEllerMedisinskKyndig = 'attfoeringskyndigEllerMedisinskKyndig',
}

export interface RettensSammensetningData {
  [RettensSammensetningField.RettensSammensetning]: RettensSammensetning | null;
  [RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig]: KyndigeMedlemmer | null;
}

export enum KjennelsensBetydningField {
  AvsagtMedForenkletBegrunnelse = 'avsagtMedForenkletBegrunnelse',
  prinsipiellBetydning = 'prinsipiellBetydning',
  BryterMedEtablertPraksisINavEllerTR = 'bryterMedEtablertPraksisINavEllerTR',
  BetydningForFlereFagomraader = 'betydningForFlereFagomraader',
  InneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss = 'inneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss',
  OmhandlerEOESRettEllerAnnetInternasjonaltRegelverk = 'omhandlerEOESRettEllerAnnetInternasjonaltRegelverk',
  BoerDelesMedFagmiljoetSomLaeringseksempel = 'boerDelesMedFagmiljoetSomLaeringseksempel',
}

export type KjennelsensBetydningOgLaeringsverdi = Record<KjennelsensBetydningField, boolean | null>;

export interface KvalitetsvurderingDataAnkeITRAfter2027 {
  [Section.OmgjortIAnkeomgangen]: OmgjortIAnkeomgangen;
  [Section.RettensSammensetning]: RettensSammensetningData;
  [Section.KjennelsensBetydningOgLaeringsverdi]: KjennelsensBetydningOgLaeringsverdi;
}

export interface IKvalitetsvurderingAnkeITRAfter2027 extends KvalitetsvurderingDataAnkeITRAfter2027 {
  type: KantKvalitetsvurdering.ANKE_ITR_V1;
  created: string;
  modified: string;
}
