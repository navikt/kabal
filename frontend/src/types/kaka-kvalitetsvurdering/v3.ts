import { AnnetFields, MainReason } from '@app/components/kvalitetsvurdering/v3/data';
import {
  BegrunnelsespliktenBoolean,
  BegrunnelsespliktenSaksdataHjemlerLists,
  ForeleggelsespliktenBoolean,
  JournalfoeringspliktenBoolean,
  KlageOgKlageforberedelsenBoolean,
  KlartSpraakBoolean,
  OmgjoeringBoolean,
  UtredningspliktenBoolean,
  VeiledningspliktenBoolean,
} from '@app/components/kvalitetsvurdering/v3/saksbehandlingsreglene/data';
import {
  SærregelverketBoolean,
  SærregelverketHjemlerFromYtelseList,
  SærregelverketSaksdataHjemlerList,
} from '@app/components/kvalitetsvurdering/v3/særregelverket/data';
import { TrygdemedisinBoolean } from '@app/components/kvalitetsvurdering/v3/trygdemedisin/data';
import type { IKvalitetsvurderingBase } from '@app/types/kaka-kvalitetsvurdering/common';
import type { Radiovalg, RadiovalgExtended } from '@app/types/kaka-kvalitetsvurdering/radio';

// Kvalitetsavvik i forvaltningen av særregelverket
interface Særregelverket extends LovenErTolketEllerAnvendtFeilIVedtaket {
  [SærregelverketBoolean.saerregelverkAutomatiskVedtak]: boolean;
  [MainReason.Særregelverket]: Radiovalg;
}

// Loven er tolket eller anvendt feil i vedtaket
interface LovenErTolketEllerAnvendtFeilIVedtaket {
  [SærregelverketBoolean.saerregelverkLovenErTolketEllerAnvendtFeil]: boolean;
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkning]: boolean;
  [SærregelverketHjemlerFromYtelseList.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList]: string[];
  [SærregelverketBoolean.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoenn]: boolean;
  [SærregelverketSaksdataHjemlerList.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList]: string[];
  [SærregelverketBoolean.saerregelverkDetErLagtTilGrunnFeilFaktum]: boolean;
  [SærregelverketSaksdataHjemlerList.saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList]: string[];
}

// Kvalitetsavvik i forvaltningen av saksbehandlingsreglene
interface Saksbehandlingsreglene
  extends BruddPåVeiledningsplikten,
    BruddPåUtredningsplikten,
    BruddPåForeleggelsesplikten,
    BruddPåBegrunnelsesplikten,
    BruddPåRegleneOmKlageOgKlageforberedelse,
    BruddPåRegleneOmOmgjøringUtenforOrdinærKlageOgAnkesaksbehandling,
    BruddPåJournalføringsplikten,
    BruddPåPliktTilÅKommuniserePåEtKlartSpråk {
  [MainReason.Saksbehandlingsreglene]: Radiovalg;
}

// Brudd på veiledningsplikten
interface BruddPåVeiledningsplikten {
  [VeiledningspliktenBoolean.saksbehandlingsreglerBruddPaaVeiledningsplikten]: boolean;
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser]: boolean;
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning]: boolean;
}

// Brudd på utredningsplikten
interface BruddPåUtredningsplikten {
  [UtredningspliktenBoolean.saksbehandlingsreglerBruddPaaUtredningsplikten]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok]: boolean;
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok]: boolean;
}

// Brudd på foreleggelsesplikten
interface BruddPåForeleggelsesplikten {
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerBruddPaaForeleggelsesplikten]: boolean;
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten]: boolean;
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten]: boolean;
}

// Brudd på begrunnelsesplikten
interface BruddPåBegrunnelsesplikten {
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBruddPaaBegrunnelsesplikten]: boolean;
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket]: boolean;
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList]: string[];
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum]: boolean;
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList]: string[];
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn]: boolean;
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList]: string[];
}

// Brudd på reglene om klage og klageforberedelse
interface BruddPåRegleneOmKlageOgKlageforberedelse {
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse]: boolean;
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert]: boolean;
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold]: boolean;
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser]: boolean;
}

// Brudd på reglene om omgjøring utenfor ordinær klage- og ankesaksbehandling
interface BruddPåRegleneOmOmgjøringUtenforOrdinærKlageOgAnkesaksbehandling {
  [OmgjoeringBoolean.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke]: boolean;
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert]: boolean;
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform]: boolean;
}

// Brudd på journalføringsplikten
interface BruddPåJournalføringsplikten {
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerBruddPaaJournalfoeringsplikten]: boolean;
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert]: boolean;
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet]: boolean;
}

// Brudd på plikten til å kommunisere på et klart språk
interface BruddPåPliktTilÅKommuniserePåEtKlartSpråk {
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak]: boolean;
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok]: boolean;
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok]: boolean;
}

// Kvalitetsavvik i saker med trygdemedisin
interface Trygdemedisin {
  [MainReason.Trygdemedisin]: RadiovalgExtended;
  [TrygdemedisinBoolean.raadgivendeLegeIkkebrukt]: boolean;
  [TrygdemedisinBoolean.raadgivendeLegeMangelfullBrukAvRaadgivendeLege]: boolean;
  [TrygdemedisinBoolean.raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin]: boolean;
  [TrygdemedisinBoolean.raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert]: boolean;
}

// Annet
interface Annet {
  [AnnetFields.annetFritekst]: string | null;
}

export interface KvalitetsvurderingDataV3 extends Særregelverket, Saksbehandlingsreglene, Trygdemedisin, Annet {}

export type KvalitetsvurderingSaksdataHjemlerV3 = Pick<
  KvalitetsvurderingDataV3,
  | SærregelverketSaksdataHjemlerList.saerregelverkVedtaketByggerPaaFeilKonkretRettsanvendelseEllerSkjoennHjemlerList
  | SærregelverketSaksdataHjemlerList.saerregelverkDetErLagtTilGrunnFeilFaktumHjemlerList
  | BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList
  | BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList
  | BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList
>;

export type KvalitetsvurderingAllRegistreringshjemlerV3 = Pick<
  KvalitetsvurderingDataV3,
  SærregelverketHjemlerFromYtelseList.saerregelverkVedtaketByggerPaaFeilHjemmelEllerLovtolkningHjemlerList
>;

export type KvalitetsvurderingStrings = Pick<KvalitetsvurderingDataV3, AnnetFields.annetFritekst>;

export type KvalitetsvurderingV3Boolean = Omit<
  KvalitetsvurderingDataV3,
  | MainReason.Særregelverket
  | MainReason.Saksbehandlingsreglene
  | MainReason.Trygdemedisin
  | keyof KvalitetsvurderingSaksdataHjemlerV3
  | keyof KvalitetsvurderingAllRegistreringshjemlerV3
  | AnnetFields.annetFritekst
>;

export interface IKvalitetsvurdering extends KvalitetsvurderingDataV3, IKvalitetsvurderingBase {
  version: 3;
}
