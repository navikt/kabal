import { REGISTRERINGSHJEMLER } from '@/types/kant';
import {
  OmgjøringHjemlerField,
  SaksbehandlingsfeilField,
  Section,
  VEDTAKET_BURDE_VAERT_OMGJORT_I_KLAGEOMGANGEN,
} from '@/types/kvalitetsvurdering/anke-after-2027';

export const SECTION_LABELS: Record<Section, string> = {
  [Section.OmgjortIKlageomgangen]: 'Burde vedtaket vært omgjort i klageomgangen?',
  [Section.SaksbehandlingsfeilIKlageomgangen]: 'Saksbehandlingsfeil i klageomgangen',
};

export enum OmgjøringErrorFields {
  omgjøringGroup = 'omgjøringGroup',
}

export const OMGJØRING_LABELS: Record<OmgjøringHjemlerField, string> = {
  [OmgjøringHjemlerField.FeilILovtolkningen]: 'Feil i lovtolkningen',
  [OmgjøringHjemlerField.FeilIFaktagrunnlaget]: 'Feil i faktagrunnlaget',
  [OmgjøringHjemlerField.FeilIRettsanvendelsen]: 'Feil i rettsanvendelsen',
};

const OMGJØRING_HJEMLER_LABELS: Record<OmgjøringHjemlerField, string> = {
  [OmgjøringHjemlerField.FeilILovtolkningen]: 'Hjemler for «Feil i lovtolkningen»',
  [OmgjøringHjemlerField.FeilIFaktagrunnlaget]: 'Hjemler for «Feil i faktagrunnlaget»',
  [OmgjøringHjemlerField.FeilIRettsanvendelsen]: 'Hjemler for «Feil i rettsanvendelsen»',
};

export const OMGJØRING_ERROR_LABELS: Record<OmgjøringErrorFields, string> = {
  [OmgjøringErrorFields.omgjøringGroup]: 'Årsaker til at vedtaket burde vært omgjort',
};

export const OMGJØRING_HELP_TEXTS: Record<OmgjøringHjemlerField, string> = {
  [OmgjøringHjemlerField.FeilILovtolkningen]:
    'Vedtaket bygger på en tolkning av bestemmelsen som ikke har forsvarlig forankring i rettskildene etter juridisk metode.',
  [OmgjøringHjemlerField.FeilIFaktagrunnlaget]:
    'Vedtaket bygger på feil faktum. For eksempel fordi viktige opplysninger eller bevis er oversett, misforstått eller tillagt feil vekt. Feilen registreres selv om det også foreligger andre saksbehandlingsfeil.',
  [OmgjøringHjemlerField.FeilIRettsanvendelsen]:
    'I vedtaket er rettsregelen anvendt feil på faktum i saken. For eksempel fordi det er utvist feil eller for strengt skjønn i vilkårsvurderingen, uavhengig av om vedtaket bygger på riktig lovtolkning og faktum.',
};

export const SAKSBEHANDLINGSFEIL_LABELS: Record<SaksbehandlingsfeilField, string> = {
  [SaksbehandlingsfeilField.SkulleHaRyddetIDokumenterEllerJournalfoertOpplysninger]:
    'Klageinstansen skulle ha ryddet i sakens dokumenter eller journalført opplysninger før vedtaket ble fattet',
  [SaksbehandlingsfeilField.SkulleHaVeiledetPartenBedre]:
    'Klageinstansen skulle ha veiledet parten bedre før vedtaket ble fattet',
  [SaksbehandlingsfeilField.SkulleHaForhaandsvarsletParten]:
    'Klageinstansen skulle ha forhåndsvarslet parten før vedtaket ble fattet',
  [SaksbehandlingsfeilField.SkulleHaForelagtOpplysningerForParten]:
    'Klageinstansen skulle ha forelagt opplysninger for parten før vedtaket ble fattet',
  [SaksbehandlingsfeilField.SkulleHaUtredetSakenBedre]:
    'Klageinstansen skulle ha utredet saken bedre før vedtaket ble fattet',
  [SaksbehandlingsfeilField.KlagevedtaketSkulleVaertBedreBegrunnet]: 'Klagevedtaket skulle vært bedre begrunnet',
  [SaksbehandlingsfeilField.SkulleHaBenyttetROL]: 'Klageinstansen skulle ha benyttet rådgivende overlege',
};

export const SAKSBEHANDLINGSFEIL_HELP_TEXTS: Record<SaksbehandlingsfeilField, string> = {
  [SaksbehandlingsfeilField.SkulleHaRyddetIDokumenterEllerJournalfoertOpplysninger]:
    'Velg denne dersom relevante opplysninger eller dokumenter ikke var journalført på riktig måte, eller dokumenthåndteringen burde vært ryddet opp i før vedtaket ble fattet. Dette gjelder også dersom dokumenttitler eller dokumentkvalitet gjorde det vanskelig å identifisere eller kontrollere sentrale opplysninger i saken.',
  [SaksbehandlingsfeilField.SkulleHaVeiledetPartenBedre]:
    'Velg denne dersom parten ikke fikk nødvendig veiledning for å kunne ivareta sine interesser i saken. Dette kan være fordi henvendelser ikke ble besvart, ble besvart mangelfullt eller feil, eller fordi klageinstansen burde gitt veiledning av eget tiltak før vedtaket ble fattet.',
  [SaksbehandlingsfeilField.SkulleHaForhaandsvarsletParten]:
    'Velg denne dersom parten skulle vært varslet og gitt anledning til å uttale seg før vedtaket ble fattet, men dette ikke ble gjort.',
  [SaksbehandlingsfeilField.SkulleHaForelagtOpplysningerForParten]:
    'Velg denne dersom opplysninger som parten hadde krav på å få kjennskap til ikke ble forelagt før vedtaket ble fattet. Dette gjelder både uttalelser fra rådgivende lege og andre opplysninger som kunne ha betydning for avgjørelsen.',
  [SaksbehandlingsfeilField.SkulleHaUtredetSakenBedre]:
    'Velg denne dersom saken ikke var tilstrekkelig opplyst før vedtaket ble fattet. For eksempel dersom det ikke er gjort tilstrekkelige forsøk på å innhente viktige eller oppdaterte opplysninger, slik at faktum ikke var tilstrekkelig klarlagt.',
  [SaksbehandlingsfeilField.KlagevedtaketSkulleVaertBedreBegrunnet]:
    'Velg denne dersom begrunnelsen ikke i tilstrekkelig grad forklarer hvilke regler vedtaket bygger på, hvilket faktum som er lagt til grunn, eller hvilke vurderinger som har vært avgjørende for resultatet.',
  [SaksbehandlingsfeilField.SkulleHaBenyttetROL]:
    'Velg denne dersom saken inneholdt trygdemedisinske problemstillinger hvor rådgivende overlege burde vært benyttet for å sikre forsvarlig utredning eller vurdering før vedtaket ble fattet.',
};

const KVALITETSVURDERING = 'kvalitetsvurdering';
const OMGJORT_I_KLAGEOMGANGEN = `${KVALITETSVURDERING}.${Section.OmgjortIKlageomgangen}` as const;

export const ValidationField = {
  Kvalitetsvurdering: KVALITETSVURDERING,
  OmgjøringIKlageomgangen: `${OMGJORT_I_KLAGEOMGANGEN}.${VEDTAKET_BURDE_VAERT_OMGJORT_I_KLAGEOMGANGEN}`,
} as const;

type HjemlerValidationField<F extends OmgjøringHjemlerField = OmgjøringHjemlerField> =
  `${typeof OMGJORT_I_KLAGEOMGANGEN}.${F}.${typeof REGISTRERINGSHJEMLER}`;

export const getHjemlerValidationField = <F extends OmgjøringHjemlerField>(field: F): HjemlerValidationField<F> =>
  `${OMGJORT_I_KLAGEOMGANGEN}.${field}.${REGISTRERINGSHJEMLER}` as const;

export type ValidationField = (typeof ValidationField)[keyof typeof ValidationField] | HjemlerValidationField;

export const KVALITETSVURDERING_ANKE_AFTER_2027_FIELD_NAMES = {
  ...SECTION_LABELS,
  ...OMGJØRING_LABELS,
  ...SAKSBEHANDLINGSFEIL_LABELS,
  [ValidationField.Kvalitetsvurdering]: 'Kvalitetsvurdering',
  [ValidationField.OmgjøringIKlageomgangen]: SECTION_LABELS[Section.OmgjortIKlageomgangen],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilILovtolkningen)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilILovtolkningen],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilIFaktagrunnlaget)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilIFaktagrunnlaget],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilIRettsanvendelsen)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilIRettsanvendelsen],
} satisfies Record<Section | OmgjøringHjemlerField | SaksbehandlingsfeilField | ValidationField, string>;

export const KVALITETSVURDERING_ANKE_AFTER_2027_CHECKBOX_GROUP_NAMES = OMGJØRING_ERROR_LABELS;
