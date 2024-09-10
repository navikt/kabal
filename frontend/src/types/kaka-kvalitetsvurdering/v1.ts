import type { IKvalitetsvurderingBase } from './common';
import type { Radiovalg, RadiovalgExtended } from './radio';

interface Version {
  version: 1;
}

export type IKvalitetsvurderingV1 = Version &
  IKvalitetsvurderingBase &
  IKvalitetsvurderingBooleans &
  IKvalitetsvurderingTexts &
  IKvalitetsvurderingRadio &
  IKvalitetsvurderingRadioExtended;

export interface IKvalitetsvurderingBooleans {
  arbeidsrettetBrukeroppfoelging: boolean;
  begrunnelseForHvorforAvslagOpprettholdes: boolean;
  begrunnelsenErIkkeKonkretOgIndividuell: boolean;
  betydeligAvvik: boolean;
  brukIOpplaering: boolean;
  detErFeilIKonkretRettsanvendelse: boolean;
  detErIkkeBruktRiktigHjemmel: boolean;
  innholdetIRettsregleneErIkkeTilstrekkeligBeskrevet: boolean;
  klagerensRelevanteAnfoerslerIkkeKommentert: boolean;
  konklusjonen: boolean;
  nyeOpplysningerMottatt: boolean;
  oversendelsesbrevetsInnholdIkkeISamsvarMedTema: boolean;
  oversittetKlagefristIkkeKommentert: boolean;
  raadgivendeLegeErBruktFeilSpoersmaal: boolean;
  raadgivendeLegeErBruktMangelfullDokumentasjon: boolean;
  raadgivendeLegeErIkkeBrukt: boolean;
  raadgivendeLegeHarUttaltSegUtoverTrygdemedisin: boolean;
  rettsregelenErBenyttetFeil: boolean;
  sakensDokumenter: boolean;
  spraaketErIkkeTydelig: boolean;
  utredningenAvAndreAktuelleForholdISaken: boolean;
  utredningenAvArbeid: boolean;
  utredningenAvEoesProblematikk: boolean;
  utredningenAvInntektsforhold: boolean;
  utredningenAvMedisinskeForhold: boolean;
  veiledningFraNav: boolean;
  vurderingAvFaktumErMangelfull: boolean;
}

export interface IKvalitetsvurderingTexts {
  arbeidsrettetBrukeroppfoelgingText: string | null;
  betydeligAvvikText: string | null;
  brukIOpplaeringText: string | null;
  utredningenAvAndreAktuelleForholdISakenText: string | null;
  utredningenAvArbeidText: string | null;
  utredningenAvEoesProblematikkText: string | null;
  utredningenAvInntektsforholdText: string | null;
  utredningenAvMedisinskeForholdText: string | null;
  veiledningFraNavText: string | null;
}

export interface IKvalitetsvurderingRadio {
  klageforberedelsenRadioValg: Radiovalg | null;
  utredningenRadioValg: Radiovalg | null;
  vedtaketRadioValg: Radiovalg | null;
}

export interface IKvalitetsvurderingRadioExtended {
  brukAvRaadgivendeLegeRadioValg: RadiovalgExtended | null;
}
