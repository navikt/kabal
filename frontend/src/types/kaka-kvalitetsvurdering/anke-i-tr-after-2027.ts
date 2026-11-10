import {
  KjennelsensBetydningOgLæringsverdiFields,
  type KyndigeMedlemmer,
  MainReason,
  OmgjøringBoolean,
  OmgjøringSaksdataHjemlerList,
  type RettensSammensetning,
  RettensSammensetningFields,
  type YesNo,
} from '@/components/kvalitetsvurdering/anke-i-tr-after-2027/data';
import type { IKvalitetsvurderingBase } from '@/types/kaka-kvalitetsvurdering/common';

interface Omgjøringsårsaker {
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList]: string[];
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: string[];
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]: boolean;
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: string[];
}

interface RettensSammensetningData {
  [RettensSammensetningFields.hvilkenSammensetningHaddeRetten]: RettensSammensetning | null;
  [RettensSammensetningFields.varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem]: KyndigeMedlemmer | null;
}

interface KjennelsensBetydningOgLæringsverdi {
  [KjennelsensBetydningOgLæringsverdiFields.erKjennelsenAvsagtMedForenkletBegrunnelse]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.reiserKjennelsenEtPrinsipieltRettsspørsmål]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.harKjennelsenBetydningForFlereFagområder]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk]: YesNo | null;
  [KjennelsensBetydningOgLæringsverdiFields.børKjennelsenDelesMedFagmiljøetSomLæringseksempel]: YesNo | null;
}

export interface KvalitetsvurderingDataAnkeITRAfter2027
  extends Omgjøringsårsaker,
    RettensSammensetningData,
    KjennelsensBetydningOgLæringsverdi {
  [MainReason.OmgjøringIAnkeomgangen]: YesNo | null;
}

export type KvalitetsvurderingAnkeITRAfter2027Boolean = Pick<Omgjøringsårsaker, OmgjøringBoolean>;

export type KvalitetsvurderingAnkeITRAfter2027SaksdataHjemler = Pick<Omgjøringsårsaker, OmgjøringSaksdataHjemlerList>;

export interface IKvalitetsvurderingAnkeITRAfter2027
  extends KvalitetsvurderingDataAnkeITRAfter2027,
    IKvalitetsvurderingBase {
  version: 4;
}
