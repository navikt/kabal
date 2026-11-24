import { BodyLong, List, VStack } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import { REGISTRERINGSHJEMLER } from '@/types/kant';
import {
  KjennelsensBetydningField,
  OmgjøringHjemlerField,
  RettensSammensetningField,
  Section,
  VEDTAKET_BURDE_VAERT_OMGJORT_I_ANKEOMGANGEN,
} from '@/types/kvalitetsvurdering/anke-i-tr-after-2027';

export const SECTION_LABELS: Record<Section, string> = {
  [Section.OmgjortIAnkeomgangen]: 'Burde vedtaket vært omgjort i ankeomgangen?',
  [Section.RettensSammensetning]: 'Rettens sammensetning',
  [Section.KjennelsensBetydningOgLaeringsverdi]: 'Vurdering av kjennelsens betydning og læringsverdi',
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

export const RETTENS_SAMMENSETNING_LABELS: Record<RettensSammensetningField, string> = {
  [RettensSammensetningField.RettensSammensetning]: 'Hvilken sammensetning hadde retten?',
  [RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig]:
    'Var retten satt med attføringskyndig eller medisinsk kyndig medlem?',
};

export enum RettensSammensetning {
  OrdinærRett = 'ORDINAER_RETT',
  TreJuridiskeMedlemmer = 'TRE_JURIDISKE_MEDLEMMER',
  FemMedlemmer = 'FEM_MEDLEMMER',
}

export const RETTENS_SAMMENSETNING_VALG_LABELS: Record<RettensSammensetning, string> = {
  [RettensSammensetning.OrdinærRett]: 'Ordinær rett',
  [RettensSammensetning.TreJuridiskeMedlemmer]: 'Tre juridiske medlemmer',
  [RettensSammensetning.FemMedlemmer]: 'Fem medlemmer',
};

export enum KyndigeMedlemmer {
  Nei = 'NEI',
  AttføringskyndigMedlem = 'JA_ATTFOERINGSKYNDIG_MEDLEM',
  MedisinskKyndigMedlem = 'JA_MEDISINSK_KYNDIG_MEDLEM',
  BådeAttføringskyndigOgMedisinskKyndigMedlem = 'JA_BAADE_ATTFORINGSKYNDIG_OG_MEDISINSK_KYNDIG_MEDLEM',
}

export const KYNDIGE_MEDLEMMER_LABELS: Record<KyndigeMedlemmer, string> = {
  [KyndigeMedlemmer.Nei]: 'Nei',
  [KyndigeMedlemmer.AttføringskyndigMedlem]: 'Ja, attføringskyndig medlem',
  [KyndigeMedlemmer.MedisinskKyndigMedlem]: 'Ja, medisinsk kyndig medlem',
  [KyndigeMedlemmer.BådeAttføringskyndigOgMedisinskKyndigMedlem]:
    'Ja, både attføringskyndig og medisinsk kyndig medlem',
};

export const KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS: Record<KjennelsensBetydningField, string> = {
  [KjennelsensBetydningField.AvsagtMedForenkletBegrunnelse]: 'Er kjennelsen avsagt med forenklet begrunnelse?',
  [KjennelsensBetydningField.prinsipiellBetydning]: 'Har kjennelsen prinsipiell betydning?',
  [KjennelsensBetydningField.BryterMedEtablertPraksisINavEllerTR]:
    'Bryter kjennelsen med etablert praksis i Nav eller Trygderetten?',
  [KjennelsensBetydningField.BetydningForFlereFagomraader]: 'Har kjennelsen betydning for flere fagområder?',
  [KjennelsensBetydningField.InneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]:
    'Inneholder kjennelsen læringspunkter knyttet til generell forvaltningsrett eller generell juss?',
  [KjennelsensBetydningField.OmhandlerEOESRettEllerAnnetInternasjonaltRegelverk]:
    'Omhandler kjennelsen EØS-rett eller annet internasjonalt regelverk?',
  [KjennelsensBetydningField.BoerDelesMedFagmiljoetSomLaeringseksempel]:
    'Bør kjennelsen deles med fagmiljøet som læringseksempel?',
};

export const KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_HELP_TEXTS: Record<
  KjennelsensBetydningField,
  string | ReactElement
> = {
  [KjennelsensBetydningField.AvsagtMedForenkletBegrunnelse]:
    'Velg ja dersom Trygderetten uttrykkelig har benyttet adgangen til å avsi kjennelsen med forenklet begrunnelse. Det har ikke betydning hvor omfattende eller grundig begrunnelsen fremstår. En kort begrunnelse er ikke nødvendigvis en forenklet begrunnelse.',
  [KjennelsensBetydningField.prinsipiellBetydning]:
    'Velg ja dersom kjennelsen tar stilling til et rettslig spørsmål som kan ha betydning utover den konkrete saken. Dette kan være fordi kjennelsen avklarer innholdet i regelverket på et område hvor rettstilstanden er usikker, eller fordi den klargjør eller bekrefter at en etablert praksis i Nav er i samsvar med regelverket. Velg normalt nei dersom kjennelsen hovedsakelig gjelder vurderingen av faktum eller anvendelsen av etablerte rettsregler på den konkrete saken.',
  [KjennelsensBetydningField.BryterMedEtablertPraksisINavEllerTR]:
    'Velg ja dersom resultatet eller begrunnelsen avviker fra praksis som tidligere har vært lagt til grunn av Nav eller Trygderetten. Det er ikke tilstrekkelig at Nav taper saken eller at retten vurderer faktum annerledes. Registreringen er ment for kjennelser som kan gi grunnlag for å revurdere eller endre etablert praksis.',
  [KjennelsensBetydningField.BetydningForFlereFagomraader]:
    'Velg ja dersom læringspunktene eller rettsoppfatningene i kjennelsen kan være relevante på tvers av flere ytelsesområder eller fagmiljøer. Eksempler kan være spørsmål om bevisvurdering, utredningsplikt, forvaltningsrettslige prinsipper eller generelle regler om medlemskap eller opphold.',
  [KjennelsensBetydningField.InneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]:
    'Velg ja dersom kjennelsen inneholder viktige avklaringer om generelle juridiske spørsmål som kan være relevante uavhengig av ytelsesområde, for eksempel om rettslig interesse, utredningsplikt, begrunnelsesplikt eller kontradiksjon.',
  [KjennelsensBetydningField.OmhandlerEOESRettEllerAnnetInternasjonaltRegelverk]:
    'Velg ja dersom EØS-rett, menneskerettigheter eller annet internasjonalt regelverk har vært relevant for rettens vurdering.',
  [KjennelsensBetydningField.BoerDelesMedFagmiljoetSomLaeringseksempel]: (
    <VStack gap="space-8">
      <BodyLong>
        Velg ja dersom kjennelsen vurderes å ha en særlig læringsverdi for fagmiljøet utover den konkrete saken.
        Formålet er å identifisere kjennelser som det er særlig nyttig å gjøre kjent i fagmiljøene. Eksempler på
        kjennelser som kan tilsi ja:
      </BodyLong>
      <List>
        <List.Item>kjennelsen avklarer et rettslig spørsmål som mange saksbehandlere kan møte</List.Item>
        <List.Item>
          kjennelsen inneholder viktige føringer for lovtolkning, bevisvurdering eller rettsanvendelse
        </List.Item>
        <List.Item>kjennelsen synliggjør en type feil som det er viktig å forebygge</List.Item>
        <List.Item>
          kjennelsen gir nyttig veiledning på et område hvor praksis har vært usikker eller omdiskutert
        </List.Item>
        <List.Item>kjennelsen er spesielt godt begrunnet og viser god juridisk metode som vi bør bruke</List.Item>
      </List>
    </VStack>
  ),
};

const KVALITETSVURDERING = 'kvalitetsvurdering';
const OMGJORT_I_ANKEOMGANGEN = `${KVALITETSVURDERING}.${Section.OmgjortIAnkeomgangen}` as const;
const RETTENS_SAMMENSETNING = `${KVALITETSVURDERING}.${Section.RettensSammensetning}` as const;
const KJENNELSENS_BETYDNING = `${KVALITETSVURDERING}.${Section.KjennelsensBetydningOgLaeringsverdi}` as const;

export const ValidationField = {
  Kvalitetsvurdering: KVALITETSVURDERING,
  OmgjøringIAnkeomgangen: `${OMGJORT_I_ANKEOMGANGEN}.${VEDTAKET_BURDE_VAERT_OMGJORT_I_ANKEOMGANGEN}`,
} as const;

type HjemlerValidationField<F extends OmgjøringHjemlerField = OmgjøringHjemlerField> =
  `${typeof OMGJORT_I_ANKEOMGANGEN}.${F}.${typeof REGISTRERINGSHJEMLER}`;

export const getHjemlerValidationField = <F extends OmgjøringHjemlerField>(field: F): HjemlerValidationField<F> =>
  `${OMGJORT_I_ANKEOMGANGEN}.${field}.${REGISTRERINGSHJEMLER}` as const;

type RettensSammensetningValidationField<F extends RettensSammensetningField = RettensSammensetningField> =
  `${typeof RETTENS_SAMMENSETNING}.${F}`;

export const getRettensSammensetningValidationField = <F extends RettensSammensetningField>(
  field: F,
): RettensSammensetningValidationField<F> => `${RETTENS_SAMMENSETNING}.${field}` as const;

type KjennelsensBetydningValidationField<F extends KjennelsensBetydningField = KjennelsensBetydningField> =
  `${typeof KJENNELSENS_BETYDNING}.${F}`;

export const getKjennelsensBetydningValidationField = <F extends KjennelsensBetydningField>(
  field: F,
): KjennelsensBetydningValidationField<F> => `${KJENNELSENS_BETYDNING}.${field}` as const;

export type ValidationField =
  | (typeof ValidationField)[keyof typeof ValidationField]
  | HjemlerValidationField
  | RettensSammensetningValidationField
  | KjennelsensBetydningValidationField;

export const KVALITETSVURDERING_ANKE_I_TR_AFTER_2027_FIELD_NAMES = {
  ...SECTION_LABELS,
  ...OMGJØRING_LABELS,
  ...RETTENS_SAMMENSETNING_LABELS,
  ...KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS,
  [ValidationField.Kvalitetsvurdering]: 'Kvalitetsvurdering',
  [ValidationField.OmgjøringIAnkeomgangen]: SECTION_LABELS[Section.OmgjortIAnkeomgangen],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilILovtolkningen)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilILovtolkningen],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilIFaktagrunnlaget)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilIFaktagrunnlaget],
  [getHjemlerValidationField(OmgjøringHjemlerField.FeilIRettsanvendelsen)]:
    OMGJØRING_HJEMLER_LABELS[OmgjøringHjemlerField.FeilIRettsanvendelsen],
  [getRettensSammensetningValidationField(RettensSammensetningField.RettensSammensetning)]:
    RETTENS_SAMMENSETNING_LABELS[RettensSammensetningField.RettensSammensetning],
  [getRettensSammensetningValidationField(RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig)]:
    RETTENS_SAMMENSETNING_LABELS[RettensSammensetningField.AttfoeringskyndigEllerMedisinskKyndig],
  [getKjennelsensBetydningValidationField(KjennelsensBetydningField.AvsagtMedForenkletBegrunnelse)]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[KjennelsensBetydningField.AvsagtMedForenkletBegrunnelse],
  [getKjennelsensBetydningValidationField(KjennelsensBetydningField.prinsipiellBetydning)]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[KjennelsensBetydningField.prinsipiellBetydning],
  [getKjennelsensBetydningValidationField(KjennelsensBetydningField.BryterMedEtablertPraksisINavEllerTR)]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[KjennelsensBetydningField.BryterMedEtablertPraksisINavEllerTR],
  [getKjennelsensBetydningValidationField(KjennelsensBetydningField.BetydningForFlereFagomraader)]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[KjennelsensBetydningField.BetydningForFlereFagomraader],
  [getKjennelsensBetydningValidationField(
    KjennelsensBetydningField.InneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss,
  )]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[
      KjennelsensBetydningField.InneholderLaeringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss
    ],
  [getKjennelsensBetydningValidationField(
    KjennelsensBetydningField.OmhandlerEOESRettEllerAnnetInternasjonaltRegelverk,
  )]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[
      KjennelsensBetydningField.OmhandlerEOESRettEllerAnnetInternasjonaltRegelverk
    ],
  [getKjennelsensBetydningValidationField(KjennelsensBetydningField.BoerDelesMedFagmiljoetSomLaeringseksempel)]:
    KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS[KjennelsensBetydningField.BoerDelesMedFagmiljoetSomLaeringseksempel],
} satisfies Record<
  Section | OmgjøringHjemlerField | RettensSammensetningField | KjennelsensBetydningField | ValidationField,
  string
>;

export const KVALITETSVURDERING_ANKE_I_TR_AFTER_2027_CHECKBOX_GROUP_NAMES = OMGJØRING_ERROR_LABELS;
