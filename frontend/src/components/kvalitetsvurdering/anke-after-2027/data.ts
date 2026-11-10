import type { KvalitetsvurderingDataAnkeAfter2027 } from '@/types/kaka-kvalitetsvurdering/anke-after-2027';

export enum MainReason {
  OmgjøringIKlageomgangen = 'burdeVedtaketVærtOmgjortIKlageomgangen',
  Saksbehandlingsfeil = 'saksbehandlingsfeilIKlageomgangen',
}

export const MAIN_REASON_LABELS: Record<MainReason, string> = {
  [MainReason.OmgjøringIKlageomgangen]: 'Burde vedtaket vært omgjort i klageomgangen?',
  [MainReason.Saksbehandlingsfeil]: 'Saksbehandlingsfeil i klageomgangen',
};

export enum YesNo {
  JA = 'JA',
  NEI = 'NEI',
}

export const JA_NEI_LABELS: Record<YesNo, string> = {
  [YesNo.JA]: 'Ja',
  [YesNo.NEI]: 'Nei',
};

export enum OmgjøringBoolean {
  omgjøringFeilILovtolkningen = 'omgjøringFeilILovtolkningen',
  omgjøringFeilIFaktagrunnlaget = 'omgjøringFeilIFaktagrunnlaget',
  omgjøringFeilIRettsanvendelsen = 'omgjøringFeilIRettsanvendelsen',
}

export enum OmgjøringSaksdataHjemlerList {
  omgjøringFeilILovtolkningenHjemlerList = 'omgjøringFeilILovtolkningenHjemlerList',
  omgjøringFeilIFaktagrunnlagetHjemlerList = 'omgjøringFeilIFaktagrunnlagetHjemlerList',
  omgjøringFeilIRettsanvendelsenHjemlerList = 'omgjøringFeilIRettsanvendelsenHjemlerList',
}

type OmgjøringFields = OmgjøringBoolean | OmgjøringSaksdataHjemlerList;

export enum OmgjøringErrorFields {
  omgjøringGroup = 'omgjøringGroup',
}

export const OMGJØRING_LABELS: Record<OmgjøringFields, string> = {
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]: 'Feil i lovtolkningen',
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]: 'Feil i faktagrunnlaget',
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]: 'Feil i rettsanvendelsen',
  [OmgjøringSaksdataHjemlerList.omgjøringFeilILovtolkningenHjemlerList]: 'Hjemler for «Feil i lovtolkningen»',
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIFaktagrunnlagetHjemlerList]: 'Hjemler for «Feil i faktagrunnlaget»',
  [OmgjøringSaksdataHjemlerList.omgjøringFeilIRettsanvendelsenHjemlerList]: 'Hjemler for «Feil i rettsanvendelsen»',
};

export const OMGJØRING_ERROR_LABELS: Record<OmgjøringErrorFields, string> = {
  [OmgjøringErrorFields.omgjøringGroup]: 'Årsaker til at vedtaket burde vært omgjort',
};

export const OMGJØRING_HELP_TEXTS: Record<OmgjøringBoolean, string> = {
  [OmgjøringBoolean.omgjøringFeilILovtolkningen]:
    'Vedtaket bygger på en tolkning av bestemmelsen som ikke har forsvarlig forankring i rettskildene etter juridisk metode.',
  [OmgjøringBoolean.omgjøringFeilIFaktagrunnlaget]:
    'Vedtaket bygger på feil faktum. For eksempel fordi viktige opplysninger eller bevis er oversett, misforstått eller tillagt feil vekt. Feilen registreres selv om det også foreligger andre saksbehandlingsfeil.',
  [OmgjøringBoolean.omgjøringFeilIRettsanvendelsen]:
    'I vedtaket er rettsregelen anvendt feil på faktum i saken. For eksempel fordi det er utvist feil eller for strengt skjønn i vilkårsvurderingen, uavhengig av om vedtaket bygger på riktig lovtolkning og faktum.',
};

export enum SaksbehandlingsfeilBoolean {
  klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet = 'klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet',
  klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet = 'klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet',
  klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet = 'klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet',
  klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet = 'klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet',
  klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet = 'klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet',
  klagevedtaketSkulleVærtBedreBegrunnet = 'klagevedtaketSkulleVærtBedreBegrunnet',
  klageinstansenSkulleHaBenyttetRådgivendeOverlege = 'klageinstansenSkulleHaBenyttetRådgivendeOverlege',
}

export const SAKSBEHANDLINGSFEIL_LABELS: Record<SaksbehandlingsfeilBoolean, string> = {
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet]:
    'Klageinstansen skulle ha ryddet i sakens dokumenter eller journalført opplysninger før vedtaket ble fattet',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet]:
    'Klageinstansen skulle ha veiledet parten bedre før vedtaket ble fattet',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet]:
    'Klageinstansen skulle ha forhåndsvarslet parten før vedtaket ble fattet',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet]:
    'Klageinstansen skulle ha forelagt opplysninger for parten før vedtaket ble fattet',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet]:
    'Klageinstansen skulle ha utredet saken bedre før vedtaket ble fattet',
  [SaksbehandlingsfeilBoolean.klagevedtaketSkulleVærtBedreBegrunnet]: 'Klagevedtaket skulle vært bedre begrunnet',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaBenyttetRådgivendeOverlege]:
    'Klageinstansen skulle ha benyttet rådgivende overlege',
};

export const SAKSBEHANDLINGSFEIL_HELP_TEXTS: Record<SaksbehandlingsfeilBoolean, string> = {
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaRyddetISakensDokumenterEllerJournalførtOpplysningerFørVedtaketBleFattet]:
    'Velg denne dersom relevante opplysninger eller dokumenter ikke var journalført på riktig måte, eller dokumenthåndteringen burde vært ryddet opp i før vedtaket ble fattet. Dette gjelder også dersom dokumenttitler eller dokumentkvalitet gjorde det vanskelig å identifisere eller kontrollere sentrale opplysninger i saken.',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaVeiledetPartenBedreFørVedtaketBleFattet]:
    'Velg denne dersom parten ikke fikk nødvendig veiledning for å kunne ivareta sine interesser i saken. Dette kan være fordi henvendelser ikke ble besvart, ble besvart mangelfullt eller feil, eller fordi klageinstansen burde gitt veiledning av eget tiltak før vedtaket ble fattet.',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForhåndsvarsletPartenFørVedtaketBleFattet]:
    'Velg denne dersom parten skulle vært varslet og gitt anledning til å uttale seg før vedtaket ble fattet, men dette ikke ble gjort.',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaForelagtOpplysningerForPartenFørVedtaketBleFattet]:
    'Velg denne dersom opplysninger som parten hadde krav på å få kjennskap til ikke ble forelagt før vedtaket ble fattet. Dette gjelder både uttalelser fra rådgivende lege og andre opplysninger som kunne ha betydning for avgjørelsen.',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaUtredetSakenBedreFørVedtaketBleFattet]:
    'Velg denne dersom saken ikke var tilstrekkelig opplyst før vedtaket ble fattet. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger, slik at faktum ikke var tilstrekkelig klarlagt.',
  [SaksbehandlingsfeilBoolean.klagevedtaketSkulleVærtBedreBegrunnet]:
    'Velg denne dersom begrunnelsen ikke i tilstrekkelig grad forklarer hvilke regler vedtaket bygger på, hvilket faktum som er lagt til grunn, eller hvilke vurderinger som har vært avgjørende for resultatet.',
  [SaksbehandlingsfeilBoolean.klageinstansenSkulleHaBenyttetRådgivendeOverlege]:
    'Velg denne dersom saken inneholdt trygdemedisinske problemstillinger hvor rådgivende overlege burde vært benyttet for å sikre forsvarlig utredning eller vurdering før vedtaket ble fattet.',
};

export const KVALITETSVURDERING_ANKE_AFTER_2027_FIELD_NAMES: Record<keyof KvalitetsvurderingDataAnkeAfter2027, string> =
  {
    [MainReason.OmgjøringIKlageomgangen]: MAIN_REASON_LABELS[MainReason.OmgjøringIKlageomgangen],
    ...OMGJØRING_LABELS,
    ...SAKSBEHANDLINGSFEIL_LABELS,
  };

export const KVALITETSVURDERING_ANKE_AFTER_2027_CHECKBOX_GROUP_NAMES = OMGJØRING_ERROR_LABELS;
