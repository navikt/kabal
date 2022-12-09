import { IKvalitetsvurderingData } from '../../../../types/kaka-kvalitetsvurdering/v2';

type Keys = keyof IKvalitetsvurderingData;

export const KVALITETSVURDERING_V2_FIELD_NAMES: Record<Keys, string> = {
  klageforberedelsenSakensDokumenter: 'Sakens dokumenter',
  klageforberedelsenSakensDokumenterRelevanteOpplysningerFraAndreFagsystemerErIkkeJournalfoert:
    'Relevante opplysninger fra andre fagsystemer er ikke journalført',
  klageforberedelsenSakensDokumenterJournalfoerteDokumenterFeilNavn: 'Journalfoerte dokumenter har feil titler/navn',
  klageforberedelsenSakensDokumenterManglerFysiskSaksmappe: 'Mangler fysisk saksmappe',

  klageforberedelsen: 'Klageforberedelsen',
  klageforberedelsenOversittetKlagefristIkkeKommentert: 'Oversittet klagefrist er ikke kommentert.',
  klageforberedelsenKlagersRelevanteAnfoerslerIkkeTilstrekkeligKommentertImoetegaatt:
    'Klagers relevante anførsler er ikke tilstrekkelig kommentert/imøtegått.',
  klageforberedelsenFeilVedBegrunnelsenForHvorforAvslagOpprettholdesKlagerIkkeOppfyllerVilkaar:
    'Feil ved begrunnelsen for hvorfor avslag opprettholdes/klager ikke oppfyller vilkår.',
  klageforberedelsenOversendelsesbrevetsInnholdErIkkeISamsvarMedSakensTema:
    'Oversendelsesbrevets innhold er ikke i samsvar med sakens tema.',
  klageforberedelsenOversendelsesbrevIkkeSendtKopiTilPartenEllerFeilMottaker:
    'Det er ikke sendt kopi av oversendelsesbrevet til parten, eller det er sendt til feil mottaker.',

  utredningen: 'Utredningen',
  utredningenAvMedisinskeForhold: 'Utredningen av medisinske forhold',
  utredningenAvInntektsforhold: 'Utredningen av inntektsforhold',
  utredningenAvArbeidsaktivitet: 'Utredningen av arbeidsaktivitet',
  utredningenAvEoesUtenlandsproblematikk: 'Utredningen av EØS-/utenlandsproblematikk',
  utredningenAvAndreAktuelleForholdISaken: 'Utredningen av andre aktuelle forhold i saken',

  vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdert:
    'Det er brukt feil hjemmel eller alle relevante hjemler er ikke vurdert',
  vedtaketBruktFeilHjemmelEllerAlleRelevanteHjemlerErIkkeVurdertHjemlerList:
    'Hjemler for "Det er brukt feil hjemmel eller alle relevante hjemler er ikke vurdert"',

  vedtaketLovbestemmelsenTolketFeil: 'Lovbestemmelsen er tolket feil',
  vedtaketLovbestemmelsenTolketFeilHjemlerList: 'Hjemler for "Lovbestemmelsen er tolket feil"',

  vedtaketFeilKonkretRettsanvendelse: 'Feil i den konkrete rettsanvendelsen',
  vedtaketFeilKonkretRettsanvendelseHjemlerList: 'Hjemler for "Feil i den konkrete rettsanvendelsen"',

  vedtaketIkkeKonkretIndividuellBegrunnelse: 'Begrunnelsen er ikke konkret og individuell nok',
  vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremFaktum:
    'Det går ikke godt nok frem hva slags faktum som er lagt til grunn',
  vedtaketIkkeKonkretIndividuellBegrunnelseIkkeGodtNokFremHvordanRettsregelenErAnvendtPaaFaktum:
    'Det går ikke godt nok frem hvordan rettsregelen er anvendt på faktum',
  vedtaketIkkeKonkretIndividuellBegrunnelseMyeStandardtekst: 'Det er mye standardtekst',

  vedtaketAutomatiskVedtak: 'Automatisk vedtak',
  vedtaket: 'Vedtaket',
  vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevet:
    'Innholdet i rettsreglene er ikke tilstrekkelig beskrevet',
  vedtaketInnholdetIRettsregleneErIkkeTilstrekkeligBeskrevetHjemlerList:
    'Hjemler for "Innholdet i rettsreglene er ikke tilstrekkelig beskrevet"',
  vedtaketDetErLagtTilGrunnFeilFaktum: 'Det er lagt til grunn feil faktum',
  vedtaketSpraakOgFormidlingErIkkeTydelig: 'Språket og formidlingen er ikke tydelig',

  raadgivendeLegeIkkebrukt: 'Rådgivende lege er ikke brukt',
  raadgivendeLegeMangelfullBrukAvRaadgivendeLege: 'Saksbehandlers bruk av rådgivende lege er mangelfull',
  raadgivendeLegeUttaltSegOmTemaUtoverTrygdemedisin: 'Rådgivende lege har uttalt seg om tema utover trygdemedisin',
  raadgivendeLegeBegrunnelseMangelfullEllerIkkeDokumentert:
    'Rådgivende lege er brukt, men begrunnelsen fra rådgivende lege er mangelfull eller ikke dokumentert',

  brukAvRaadgivendeLege: 'Bruk av rådgivende lege',

  annetFritekst: 'Annet',
};

export const KVALITETSVURDERING_V2_CHECKBOX_GROUP_NAMES = {
  klageforberedelsenGroup: 'Mangelfull klageforberedelse',
  utredningenGroup: 'Mangelfull utredning',
  vedtaketGroup: 'Mangelfullt vedtak',
  raadgivendeLegeGroup: 'Mangelfull bruk av rådgivende lege',
};

export const useKvalitetsvurderingV2FieldName = (field: Keys): string => KVALITETSVURDERING_V2_FIELD_NAMES[field];
