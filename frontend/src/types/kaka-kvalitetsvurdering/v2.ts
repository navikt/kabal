import { IKvalitetsvurderingBase } from './common';
import { Radiovalg, RadiovalgExtended } from './radio';

interface SakensDokumenter {
  klageforberedelsenSakensDokumenter: boolean; // Sakens dokumenter.
  klageforberedelsenSakensDokumenterRelevanteOpplysningerFraAndreFagsystemerErIkkeJournalfoert: boolean; // Relevante opplysninger fra andre fagsystemer er ikke journalført.
  klageforberedelsenSakensDokumenterJournalfoerteDokumenterFeilNavn: boolean; // Journalførte dokumenter har feil titler/navn.
  klageforberedelsenSakensDokumenterManglerFysiskSaksmappe: boolean; // Mangler fysisk saksmappe.
}

interface Klageforberedelsen extends SakensDokumenter {
  klageforberedelsen: Radiovalg | null; // Klageforberedelsen.
  klageforberedelsenOversittetKlagefristIkkeKommentert: boolean; // Oversittet klagefrist er ikke kommentert.
  klageforberedelsenKlagersRelevanteAnfoerslerIkkeTilstrekkeligKommentertImoetegaatt: boolean; // Klagers relevante anførsler er ikke tilstrekkelig kommentert/imøtegått.
  klageforberedelsenFeilVedBegrunnelsenForHvorforAvslagOpprettholdesKlagerIkkeOppfyllerVilkaar: boolean; // Feil ved begrunnelsen for hvorfor avslag opprettholdes/klager ikke oppfyller vilkår.
  klageforberedelsenOversendelsesbrevetsInnholdErIkkeISamsvarMedSakensTema: boolean; // Oversendelsesbrevets innhold er ikke i samsvar med sakens tema.
  klageforberedelsenOversendelsesbrevIkkeSendtKopiTilPartenEllerFeilMottaker: boolean; // Det er ikke sendt kopi av oversendelsesbrevet til parten, eller det er sendt til feil mottaker.
}

interface Utredningen {
  utredningen: Radiovalg | null; // Utredningen.
  utredningenAvMedisinskeForhold: boolean; // Utredningen av medisinske forhold.
  utredningenAvInntektsforhold: boolean; // Utredningen av inntektsforhold.
  utredningenAvArbeidsaktivitet: boolean; // Utredningen av arbeidsaktivitet.
  utredningenAvEoesUtenlandsproblematikk: boolean; // Utredningen av EØS-/utenlandsproblematikk.
  utredningenAvAndreAktuelleForholdISaken: boolean; // Utredningen av andre aktuelle forhold i saken.
}

interface BruktFeilHjemler {
  vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdert: boolean; // Det er brukt feil hjemmel eller alle relevante hjemler er ikke vurdert.
  vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdertHjemlerList: string[]; // Default alle hjemler fra saksdata.
}

interface LovbestemmelsenTolketFeil {
  vedtaketLovbestemmelsenTolketFeil: boolean; // Lovbestemmelsen er tolket feil
  vedtaketLovbestemmelsenTolketFeilHjemlerList: string[]; // Default alle hjemler fra saksdata.
}

interface InnholdetIRettsreglene {
  vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevet: boolean; // Innholdet i rettsreglene er ikke tilstrekkelig beskrevet.
  vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevetHjemlerList: string[]; // Default alle hjemler fra saksdata.
}

interface FeilKonkretRettsanvendelse {
  vedtaketFeilKonkretRettsanvendelse: boolean; // Feil i den konkrete rettsanvendelsen.
  vedtaketFeilKonkretRettsanvendelseHjemlerList: string[]; // Default alle hjemler fra saksdata.
}

interface KonkretIndividuellBegrunnelse {
  vedtaketIkkeKonkretIndividuellBegrunnelse: boolean; // Begrunnelsen er ikke konkret og individuell nok.
  vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremFaktum: boolean; // Det går ikke godt nok frem hva slags faktum som er lagt til grunn.
  vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremHvordanRettsregelenErAnvendtPaaFaktum: boolean; // Det går ikke godt nok frem hvordan rettsregelen er anvendt på faktum.
  vedtaketIkkeKonkretIndividuellBegrunnelseMyeStandardtekst: boolean; // Det er mye standardtekst.
}

interface Vedtaket
  extends BruktFeilHjemler,
    LovbestemmelsenTolketFeil,
    InnholdetIRettsreglene,
    FeilKonkretRettsanvendelse,
    KonkretIndividuellBegrunnelse {
  vedtaketAutomatiskVedtak: boolean; // Avhuking for automatiske vedtak.
  vedtaket: Radiovalg | null; // Vedtaket.
  vedtaketDetErLagtTilGrunnFeilFaktum: boolean; // Det er lagt til grunn feil faktum.
  vedtaketSpraakOgFormidlingErIkkeTydelig: boolean; // Språket og formidlingen er ikke tydelig.
}

interface BrukAvRaadgivendeLegeMangelfullt {
  raadgivendeLegeIkkebrukt: boolean; // Rådgivende lege er ikke brukt.
  raadgivendeLegeMangelfullBrukAvRaadgivendeLege: boolean; // Saksbehandlers bruk av rådgivende lege er mangelfull.
  raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin: boolean; // Rådgivende lege har uttalt seg om tema utover trygdemedisin.
  raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert: boolean; // Rådgivende lege er brukt, men begrunnelsen fra rådgivende lege er mangelfull eller ikke dokumentert.
}

interface BrukAvRaadgivendeLege extends BrukAvRaadgivendeLegeMangelfullt {
  brukAvRaadgivendeLege: RadiovalgExtended | null; // Bruk av rådgivende lege.
}

interface Annet {
  annetFritekst: string | null; // Annet (valgfri).
}

export type IKvalitetsvurderingBooleans = Omit<
  IKvalitetsvurderingData,
  | 'klageforberedelsen'
  | 'utredningen'
  | 'annetFritekst'
  | 'brukAvRaadgivendeLege'
  | 'vedtaket'
  | 'vedtaketLovbestemmelsenTolketFeilHjemlerList'
  | 'vedtaketFeilKonkretRettsanvendelseHjemlerList'
  | 'vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdertHjemlerList'
  | 'vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevetHjemlerList'
>;

export interface IKvalitetsvurderingData
  extends Klageforberedelsen,
    Utredningen,
    Vedtaket,
    Vedtaket,
    BrukAvRaadgivendeLege,
    Annet {}

export interface IKvalitetsvurdering extends IKvalitetsvurderingData, IKvalitetsvurderingBase {
  version: 2;
}
