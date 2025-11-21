import { MAIN_REASON_LABELS, MainReason } from '@app/components/kvalitetsvurdering/v3/data';

export const HEADER = MAIN_REASON_LABELS[MainReason.Saksbehandlingsreglene];

export enum VeiledningspliktenBoolean {
  saksbehandlingsreglerBruddPaaVeiledningsplikten = 'saksbehandlingsreglerBruddPaaVeiledningsplikten',
  saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser = 'saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser',
  saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning = 'saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning',
}

export enum UtredningspliktenBoolean {
  saksbehandlingsreglerBruddPaaUtredningsplikten = 'saksbehandlingsreglerBruddPaaUtredningsplikten',
  saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok',
  saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok',
  saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok',
  saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok',
  saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok',
  saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok = 'saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok',
}

export enum ForeleggelsespliktenBoolean {
  saksbehandlingsreglerBruddPaaForeleggelsesplikten = 'saksbehandlingsreglerBruddPaaForeleggelsesplikten',
  saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten = 'saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten',
  saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten = 'saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten',
}

export enum BegrunnelsespliktenBoolean {
  saksbehandlingsreglerBruddPaaBegrunnelsesplikten = 'saksbehandlingsreglerBruddPaaBegrunnelsesplikten',
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket',
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum',
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn',
}

// Selected registreringshjemler from saksdata
export enum BegrunnelsespliktenSaksdataHjemlerLists {
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList',
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList',
  saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList = 'saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList',
}

export enum KlageOgKlageforberedelsenBoolean {
  saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse = 'saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse',
  saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert = 'saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert',
  saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold = 'saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold',
  saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser = 'saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser',
}

export enum OmgjoeringBoolean {
  saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke = 'saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke',
  saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert = 'saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert',
  saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform = 'saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform',
}

export enum JournalfoeringspliktenBoolean {
  saksbehandlingsreglerBruddPaaJournalfoeringsplikten = 'saksbehandlingsreglerBruddPaaJournalfoeringsplikten',
  saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert = 'saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert',
  saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet = 'saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet',
}

export enum KlartSpraakBoolean {
  saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak = 'saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak',
  saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok = 'saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok',
  saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok = 'saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok',
}

export type AllSaksbehandlingsregleneBoolean =
  | VeiledningspliktenBoolean
  | UtredningspliktenBoolean
  | ForeleggelsespliktenBoolean
  | BegrunnelsespliktenBoolean
  | JournalfoeringspliktenBoolean
  | KlageOgKlageforberedelsenBoolean
  | OmgjoeringBoolean
  | KlartSpraakBoolean;

type Fields = AllSaksbehandlingsregleneBoolean | BegrunnelsespliktenSaksdataHjemlerLists;

const FIELDS = Object.values({
  ...VeiledningspliktenBoolean,
  ...UtredningspliktenBoolean,
  ...ForeleggelsespliktenBoolean,
  ...BegrunnelsespliktenBoolean,
  ...KlageOgKlageforberedelsenBoolean,
  ...OmgjoeringBoolean,
  ...JournalfoeringspliktenBoolean,
  ...KlartSpraakBoolean,
  ...BegrunnelsespliktenSaksdataHjemlerLists,
});

export const isSaksbehandlingsregleneField = (value: string): value is Fields => FIELDS.some((f) => f === value);

export enum SaksbehandlingsregleneErrorFields {
  saksbehandlingsreglerGroup = 'saksbehandlingsreglerGroup',
  saksbehandlingsreglerBruddPaaVeiledningspliktenGroup = 'saksbehandlingsreglerBruddPaaVeiledningspliktenGroup',
  saksbehandlingsreglerBruddPaaUtredningspliktenGroup = 'saksbehandlingsreglerBruddPaaUtredningspliktenGroup',
  saksbehandlingsreglerBruddPaaForeleggelsespliktenGroup = 'saksbehandlingsreglerBruddPaaForeleggelsespliktenGroup',
  saksbehandlingsreglerBruddPaaBegrunnelsespliktenGroup = 'saksbehandlingsreglerBruddPaaBegrunnelsespliktenGroup',

  saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelseGroup = 'saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelseGroup',
  saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnkeGroup = 'saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnkeGroup',
  saksbehandlingsreglerBruddPaaJournalfoeringspliktenGroup = 'saksbehandlingsreglerBruddPaaJournalfoeringspliktenGroup',
  saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraakGroup = 'saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraakGroup',
}

const ERROR_FIELDS = Object.values(SaksbehandlingsregleneErrorFields);

export const isSaksbehandlingsregleneErrorField = (value: string): value is SaksbehandlingsregleneErrorFields =>
  ERROR_FIELDS.some((f) => f === value);

export const SAKSBEHANDLINGSREGLENE_LABELS: Record<Fields, string> = {
  // Veiledningsplikten
  [VeiledningspliktenBoolean.saksbehandlingsreglerBruddPaaVeiledningsplikten]:
    'Brudd på veiledningsplikten, forvaltningsloven § 11',
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser]:
    'Parten har ikke fått svar på henvendelser i saken, eller har fått feil svar.',
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning]:
    'Nav har ikke gitt god nok veiledning i saken av eget tiltak.',

  // Utredningsplikten
  [UtredningspliktenBoolean.saksbehandlingsreglerBruddPaaUtredningsplikten]:
    'Brudd på utredningsplikten, forvaltningsloven § 17',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok]:
    'Utredningen av medisinske forhold har ikke vært god nok',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok]:
    'Utredningen av inntekts/-arbeidsforhold har ikke vært god nok',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok]:
    'Utredningen av EØS-/utenlandsforhold har ikke vært god nok',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok]:
    'Utredningen av sivilstands-/boforhold har ikke vært god nok',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok]:
    'Utredningen av samværsforhold har ikke vært god nok',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok]:
    'Utredningen av andre forhold i saken har ikke vært god nok',

  // Foreleggelsesplikten
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerBruddPaaForeleggelsesplikten]:
    'Brudd på foreleggelsesplikten, forvaltningsloven §§ 17 og 18 til 19',
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten]:
    'Uttalelse fra rådgivende lege i saken har ikke vært forelagt parten',
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten]:
    'Andre opplysninger i saken har ikke vært forelagt parten',

  // Begrunnelsesplikten
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBruddPaaBegrunnelsesplikten]:
    'Brudd på begrunnelsesplikten, forvaltningsloven §§ 24 og 25',
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket]:
    'Begrunnelsen viser ikke til regelverket som vedtaket bygger på',
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum]:
    'Begrunnelsen nevner ikke hvilket faktum som vedtaket bygger på',
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn]:
    'Begrunnelsen nevner ikke de hensyn som har vært avgjørende for den konkrete rettsanvendelsen eller skjønnsutøvelsen som vedtaket bygger på',

  // Klage og klageforberedelse
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse]:
    'Brudd på reglene om klage og klageforberedelse, forvaltningsloven §§ 28 til 33',
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert]:
    'Klagefristen eller oppreisning for fristoversittelse er ikke vurdert, eller er vurdert feil',
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold]:
    'Det er ikke sørget for retting av feil i klagens form eller innhold',
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser]:
    'Under klageforberedelsen er det ikke utredet om klagen faktisk er en klage eller hva i vedtaket som påklages, eller ikke gjort andre undersøkelser som klagen gir grunn til',

  // Omgjøring
  [OmgjoeringBoolean.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke]:
    'Brudd på reglene om omgjøring utenfor ordinær klage- og ankesaksbehandling, forvaltningsloven § 35',
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert]:
    'Ugyldighet og omgjøring av vedtak til skade for en part er ikke vurdert eller er vurdert feil',
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform]:
    'Det er fattet vedtak til tross for at beslutning var riktig avgjørelsesform',

  // Journalføringsplikten
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerBruddPaaJournalfoeringsplikten]:
    'Brudd på journalføringsplikten, arkivloven §§ 6 og 12 og forskrift §§ 9 følgende.',
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert]:
    'Relevante opplysninger er ikke journalført på saken',
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet]:
    'Relevante opplysninger som er journalført på saken har ikke god nok tittel eller dokumentkvalitet',
  // Klart språk
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak]:
    'Brudd på plikten til å kommunisere på et klart språk, språklova § 9',
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok]:
    'Språket i vedtaket er ikke klart nok',
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok]:
    'Språket i oversendelsesbrevet er ikke klart nok',

  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverketHjemlerList]:
    'Hjemler for «Begrunnelsen viser ikke til regelverket som vedtaket bygger på»',
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktumHjemlerList]:
    'Hjemler for «Begrunnelsen nevner ikke hvilket faktum som vedtaket bygger på»',
  [BegrunnelsespliktenSaksdataHjemlerLists.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensynHjemlerList]:
    'Hjemler for «Begrunnelsen nevner ikke de hensyn som har vært avgjørende for den konkrete rettsanvendelsen eller skjønnsutøvelsen som vedtaket bygger på»',
};

export const SAKSBEHANDLINGSREGLENE_ERROR_LABELS: Record<SaksbehandlingsregleneErrorFields, string> = {
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerGroup]: HEADER,
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaVeiledningspliktenGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[VeiledningspliktenBoolean.saksbehandlingsreglerBruddPaaVeiledningsplikten],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaUtredningspliktenGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[UtredningspliktenBoolean.saksbehandlingsreglerBruddPaaUtredningsplikten],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaForeleggelsespliktenGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[ForeleggelsespliktenBoolean.saksbehandlingsreglerBruddPaaForeleggelsesplikten],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaBegrunnelsespliktenGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[BegrunnelsespliktenBoolean.saksbehandlingsreglerBruddPaaBegrunnelsesplikten],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelseGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[
      KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaRegleneOmKlageOgKlageforberedelse
    ],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnkeGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[OmgjoeringBoolean.saksbehandlingsreglerBruddPaaRegleneOmOmgjoeringUtenforKlageOgAnke],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaJournalfoeringspliktenGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[JournalfoeringspliktenBoolean.saksbehandlingsreglerBruddPaaJournalfoeringsplikten],
  [SaksbehandlingsregleneErrorFields.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraakGroup]:
    SAKSBEHANDLINGSREGLENE_LABELS[
      KlartSpraakBoolean.saksbehandlingsreglerBruddPaaPliktTilAaKommuniserePaaEtKlartSpraak
    ],
};
export const SAKSBEHANDLINGSREGLENE_HELP_TEXTS: Partial<Record<Fields, string>> = {
  // Veiledningsplikten
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenPartenHarIkkeFaattSvarPaaHenvendelser]:
    'Du velger denne dersom veiledningen ikke har gitt parten mulighet til å ivareta interessene sine i saken på en god nok måte fordi henvendelser fra parten ikke har blitt besvart, eller har blitt mangelfullt eller misvisende besvart.',
  [VeiledningspliktenBoolean.saksbehandlingsreglerVeiledningspliktenNavHarIkkeGittGodNokVeiledning]:
    'Du velger denne dersom Nav åpenbart skulle gitt veiledning av eget tiltak før det ble fattet vedtak, men dette ikke er gjort, eller Nav har gitt mangelfull eller misvisende veiledning, slik at parten ikke er gitt mulighet til å ivareta interessene sine i saken på en god nok måte.',

  // Utredningsplikten
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvMedisinskeForholdHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort trygdemedisinsk faktum tilstrekkelig klart før det ble fattet vedtak. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte helseopplysninger fra behandler. Se også egne spørsmål om kvalitetsavvik i saker med trygdemedisin.',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvInntektsArbeidsforholdHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort faktum om inntekter eller arbeidsforhold tilstrekkelig klart før det ble fattet vedtak. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger fra arbeidsgiver.',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvEoesUtenlandsforholdHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort faktum om EØS-/utenlandsforhold tilstrekkelig klart før det ble fattet vedtak. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger fra utenlandske trygdemyndigheter.',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSivilstandsBoforholdHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort faktum om sivilstands-/boforhold tilstrekkelig klart før det ble fattet vedtak. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger fra offentlige registre eller parten.',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvSamvaersforholdHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort faktum om samværsforhold tilstrekkelig klart før det ble fattet vedtak. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger fra begge parter.',
  [UtredningspliktenBoolean.saksbehandlingsreglerUtredningspliktenUtredningenAvAndreForholdISakenHarIkkeVaertGodNok]:
    'Du velger denne dersom utredningen av saken ikke har gjort faktum om andre forhold enn det som er nevnt ovenfor tilstrekkelig klart før det ble fattet vedtak.',

  // Foreleggelsesplikten
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenUttalelseFraRaadgivendeLegeHarIkkeVaertForelagtParten]:
    'Du velger denne dersom en uttalelse fra rådgivende lege ikke har vært forelagt parten med frist til å uttale seg før det er fattet vedtak som er negativt for parten.',
  [ForeleggelsespliktenBoolean.saksbehandlingsreglerForeleggelsespliktenAndreOpplysningerISakenHarIkkeVaertForelagtParten]:
    'Du velger denne dersom det under saksbehandlingen er mottatt opplysninger som parten har rett til innsyn i og som det ikke er grunnlag for å unnta fra foreleggelse, og disse skulle vært forelagt parten.',

  // Begrunnelsesplikten
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenViserIkkeTilRegelverket]:
    'Du velger denne dersom vedtaket ikke viser til relevant regelverk eller ikke presenterer innholdet av reglene eller de rettslige problemstillingene på en forståelig nok måte. Jo mer komplisert regelverket eller problemstillingene er, desto mer kreves for å presentere regelinnholdet på en forsvarlig måte.',
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeFaktum]:
    'Du velger denne dersom vedtaket ikke nevner det faktum som er viktig for å ta stilling til de rettslige problemstillingene. Selv om faktum er beskrevet av parten selv i en tidligere framstilling eller i et dokument som parten allerede er gjort kjent med, kan det være uenighet eller tvil om hvordan faktum skal tolkes. Begrunnelsen vil være mangelfull dersom den ikke gjør parten i stand til å forstå hvordan forvaltningen selv har vurdert faktum.',
  [BegrunnelsespliktenBoolean.saksbehandlingsreglerBegrunnelsespliktenBegrunnelsenNevnerIkkeAvgjoerendeHensyn]:
    'Du velger denne dersom vedtaket ikke nevner de hensyn som er avgjørende for den lovbundne skjønnsutøvelsen. Enten ved at det ikke vises til relevante deler av rundskriv, eller ved at det ikke er nevnt andre avgjørende hensyn. Dersom vedtaket er negativt for parten, men det er vektige hensyn som taler for og mot partens syn, er det feil å ikke nevne begge deler.',

  // Klage og klageforberedelse
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageKlagefristenEllerOppreisningErIkkeVurdertEllerFeilVurdert]:
    'Du velger denne dersom underinstansen har oversett klagefristen eller dersom vurderingen av fristoversittelse eller oppreisning for oversittelsen er feil.',
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageDetErIkkeSoergetForRettingAvFeilIKlagensFormEllerInnhold]:
    'Du velger denne dersom underinstansen har oversett kravene som stilles til en klages form og innhold, eller ikke har gitt parten mulighet til å rette slike feil. For eksempel dersom klagen ikke er undertegnet. Eller dersom klagen ikke er formulert på en slik måte at det kan identifiseres hvilken endring av vedtaket parten ønsker.',
  [KlageOgKlageforberedelsenBoolean.saksbehandlingsreglerBruddPaaKlageUnderKlageforberedelsenErDetIkkeUtredetEllerGjortUndersoekelser]:
    'Du velger denne dersom en henvendelse fra parten har blitt behandlet som en klage, til tross for at det er usikkert om det faktisk er ment som en klage. Tilsvarende dersom det er usikkert hva i vedtaket som påklages, og dette burde vært undersøkt. Du velger også denne dersom underinstansen ikke har vurdert nye opplysninger som er tilkommet saken før den oversendes klageinstansen.',

  // Omgjøring
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringUgyldighetOgOmgjoeringErIkkeVurdertEllerFeilVurdert]:
    'Du velger denne dersom vedtaket er omgjort til skade for parten uten å vurdere om vedtaket er ugyldig og kan omgjøres. Du velger også denne dersom vurderingen av ugyldighet og omgjøring til skade for parten er feil. Tilsvarende dersom det er flere parter i saken, og omgjøringen er til skade for minst en av partene.',
  [OmgjoeringBoolean.saksbehandlingsreglerOmgjoeringDetErFattetVedtakTilTrossForAtBeslutningVarRiktigAvgjoerelsesform]:
    'Du velger denne dersom det er avslått et omgjøringskrav i vedtaks form og gitt klage- eller ankeadgang, til tross for at avgjørelsen egentlig er en prosessledende beslutning som ikke kan påklages/påankes.',

  // Journalføringsplikten
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerErIkkeJournalfoert]:
    'Du velger denne dersom opplysninger som er relevante for å behandle saken ikke er journalført i Navs godkjente arkivsystem, eller ikke er journalført på den saken som klageinstansen har til behandling. Om dokumentet er et saksdokument som skal journalføres på den aktuelle saken som er til behandling, beror på om dokumentet inneholder opplysninger som er relevante for / inngår i den samme avgjørelsesprosessen.',
  [JournalfoeringspliktenBoolean.saksbehandlingsreglerJournalfoeringspliktenRelevanteOpplysningerHarIkkeGodNokTittelEllerDokumentkvalitet]:
    'Du velger denne dersom tittel på det journalførte dokumentet ikke beskriver innholdet, eller dersom selve dokumentkvaliteten gjør det journalførte dokumentet vanskelig å lese eller kontrollere.',

  // Klart språk
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIVedtaketErIkkeKlartNok]:
    'Du velger denne dersom innholdet i vedtaket ikke er formidlet på en klar nok måte. For eksempel dersom det er dårlig struktur eller sammenheng i teksten, slik at innholdet blir uklart fordi setningene ikke henger sammen eller vanskelige ord ikke er forklart. Et vedtak som er klart skrevet, blir forstått av mottakeren uten at vedkommende må lese det mange ganger eller er nødt til å bruke hjelpemidler. Klart språk trenger ikke å være fritt for fagord. Det er formålet og målgruppen for vedtaket som avgjør.',
  [KlartSpraakBoolean.saksbehandlingsreglerBruddPaaKlartSprakSpraketIOversendelsesbrevetsErIkkeKlartNok]:
    'Du velger denne dersom innholdet i oversendelsesbrevet ikke er formidlet på en klar nok måte. For eksempel dersom det er dårlig struktur eller sammenheng i teksten, slik at innholdet blir uklart fordi setningene ikke henger sammen eller vanskelige ord ikke er forklart. Et oversendelsesbrev som er klart skrevet, blir forstått av mottakeren uten at vedkommende må lese det mange ganger eller er nødt til å bruke hjelpemidler. Klart språk trenger ikke å være fritt for fagord. Det er formålet og målgruppen for oversendelsesbrevet som avgjør.',
};
