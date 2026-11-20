import { BodyLong, List, VStack } from '@navikt/ds-react';
import type { ReactElement } from 'react';
import type { KvalitetsvurderingDataAnkeITRAfter2027 } from '@/types/kaka-kvalitetsvurdering/anke-i-tr-after-2027';

export enum MainReason {
  OmgjøringIAnkeomgangen = 'burdeVedtaketVærtOmgjortIAnkeomgangen',
  RettensSammensetning = 'rettensSammensetning',
  KjennelsensBetydningOgLæringsverdi = 'kjennelsensBetydningOgLæringsverdi',
}

export const MAIN_REASON_LABELS: Record<MainReason, string> = {
  [MainReason.OmgjøringIAnkeomgangen]: 'Burde vedtaket vært omgjort i ankeomgangen?',
  [MainReason.RettensSammensetning]: 'Rettens sammensetning',
  [MainReason.KjennelsensBetydningOgLæringsverdi]: 'Vurdering av kjennelsens betydning og læringsverdi',
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

export enum RettensSammensetningFields {
  hvilkenSammensetningHaddeRetten = 'hvilkenSammensetningHaddeRetten',
  varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem = 'varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem',
}

export const RETTENS_SAMMENSETNING_LABELS: Record<RettensSammensetningFields, string> = {
  [RettensSammensetningFields.hvilkenSammensetningHaddeRetten]: 'Hvilken sammensetning hadde retten?',
  [RettensSammensetningFields.varRettenSattMedAttføringskyndigEllerMedisinskKyndigMedlem]:
    'Var retten satt med attføringskyndig eller medisinsk kyndig medlem?',
};

export enum RettensSammensetning {
  OrdinærRett = 'ORDINÆR_RETT',
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
  AttføringskyndigMedlem = 'ATTFØRINGSKYNDIG_MEDLEM',
  MedisinskKyndigMedlem = 'MEDISINSK_KYNDIG_MEDLEM',
  BådeAttføringskyndigOgMedisinskKyndigMedlem = 'BÅDE_ATTFØRINGSKYNDIG_OG_MEDISINSK_KYNDIG_MEDLEM',
}

export const KYNDIGE_MEDLEMMER_LABELS: Record<KyndigeMedlemmer, string> = {
  [KyndigeMedlemmer.Nei]: 'Nei',
  [KyndigeMedlemmer.AttføringskyndigMedlem]: 'Ja, attføringskyndig medlem',
  [KyndigeMedlemmer.MedisinskKyndigMedlem]: 'Ja, medisinsk kyndig medlem',
  [KyndigeMedlemmer.BådeAttføringskyndigOgMedisinskKyndigMedlem]:
    'Ja, både attføringskyndig og medisinsk kyndig medlem',
};

export enum KjennelsensBetydningOgLæringsverdiFields {
  erKjennelsenAvsagtMedForenkletBegrunnelse = 'erKjennelsenAvsagtMedForenkletBegrunnelse',
  reiserKjennelsenEtPrinsipieltRettsspørsmål = 'reiserKjennelsenEtPrinsipieltRettsspørsmål',
  bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten = 'bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten',
  harKjennelsenBetydningForFlereFagområder = 'harKjennelsenBetydningForFlereFagområder',
  inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss = 'inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss',
  omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk = 'omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk',
  børKjennelsenDelesMedFagmiljøetSomLæringseksempel = 'børKjennelsenDelesMedFagmiljøetSomLæringseksempel',
}

export const KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS: Record<KjennelsensBetydningOgLæringsverdiFields, string> = {
  [KjennelsensBetydningOgLæringsverdiFields.erKjennelsenAvsagtMedForenkletBegrunnelse]:
    'Er kjennelsen avsagt med forenklet begrunnelse?',
  [KjennelsensBetydningOgLæringsverdiFields.reiserKjennelsenEtPrinsipieltRettsspørsmål]:
    'Reiser kjennelsen et prinsipielt rettsspørsmål?',
  [KjennelsensBetydningOgLæringsverdiFields.bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten]:
    'Bryter kjennelsen med etablert praksis i Nav eller Trygderetten?',
  [KjennelsensBetydningOgLæringsverdiFields.harKjennelsenBetydningForFlereFagområder]:
    'Har kjennelsen betydning for flere fagområder?',
  [KjennelsensBetydningOgLæringsverdiFields.inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]:
    'Inneholder kjennelsen læringspunkter knyttet til generell forvaltningsrett eller generell juss?',
  [KjennelsensBetydningOgLæringsverdiFields.omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk]:
    'Omhandler kjennelsen EØS-rett eller annet internasjonalt regelverk?',
  [KjennelsensBetydningOgLæringsverdiFields.børKjennelsenDelesMedFagmiljøetSomLæringseksempel]:
    'Bør kjennelsen deles med fagmiljøet som læringseksempel?',
};

export const KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_HELP_TEXTS: Record<
  KjennelsensBetydningOgLæringsverdiFields,
  string | ReactElement
> = {
  [KjennelsensBetydningOgLæringsverdiFields.erKjennelsenAvsagtMedForenkletBegrunnelse]:
    'Velg ja dersom Trygderetten uttrykkelig har benyttet adgangen til å avsi kjennelsen med forenklet begrunnelse. Det har ikke betydning hvor omfattende eller grundig begrunnelsen fremstår. En kort begrunnelse er ikke nødvendigvis en forenklet begrunnelse.',
  [KjennelsensBetydningOgLæringsverdiFields.reiserKjennelsenEtPrinsipieltRettsspørsmål]:
    'Velg ja dersom kjennelsen tar stilling til et rettslig spørsmål som kan ha betydning utover den konkrete saken, eller bidrar til å avklare innholdet i regelverket på et område hvor rettstilstanden er usikker. Velg normalt nei dersom kjennelsen hovedsakelig gjelder vurderingen av faktum eller anvendelsen av etablerte rettsregler på den konkrete saken.',
  [KjennelsensBetydningOgLæringsverdiFields.bryterKjennelsenMedEtablertPraksisINavEllerTrygderetten]:
    'Velg ja dersom resultatet eller begrunnelsen avviker fra praksis som tidligere har vært lagt til grunn av Nav eller Trygderetten. Det er ikke tilstrekkelig at Nav taper saken eller at retten vurderer faktum annerledes. Registreringen er ment for kjennelser som kan gi grunnlag for å revurdere eller endre etablert praksis.',
  [KjennelsensBetydningOgLæringsverdiFields.harKjennelsenBetydningForFlereFagområder]:
    'Velg ja dersom læringspunktene eller rettsoppfatningene i kjennelsen kan være relevante på tvers av flere ytelsesområder eller fagmiljøer. Eksempler kan være spørsmål om bevisvurdering, utredningsplikt, forvaltningsrettslige prinsipper eller generelle regler om medlemskap eller opphold.',
  [KjennelsensBetydningOgLæringsverdiFields.inneholderKjennelsenLæringspunkterKnyttetTilGenerellForvaltningsrettEllerGenerellJuss]:
    'Velg ja dersom kjennelsen inneholder viktige avklaringer om generelle juridiske spørsmål som kan være relevante uavhengig av ytelsesområde, for eksempel om rettslig interesse, utredningsplikt, begrunnelsesplikt eller kontradiksjon.',
  [KjennelsensBetydningOgLæringsverdiFields.omhandlerKjennelsenEØSrettEllerAnnetInternasjonaltRegelverk]:
    'Velg ja dersom EØS-rett, menneskerettigheter eller annet internasjonalt regelverk har vært relevant for rettens vurdering.',
  [KjennelsensBetydningOgLæringsverdiFields.børKjennelsenDelesMedFagmiljøetSomLæringseksempel]: (
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

export const KVALITETSVURDERING_ANKE_I_TR_AFTER_2027_FIELD_NAMES: Record<
  keyof KvalitetsvurderingDataAnkeITRAfter2027,
  string
> = {
  [MainReason.OmgjøringIAnkeomgangen]: MAIN_REASON_LABELS[MainReason.OmgjøringIAnkeomgangen],
  ...OMGJØRING_LABELS,
  ...RETTENS_SAMMENSETNING_LABELS,
  ...KJENNELSENS_BETYDNING_OG_LÆRINGSVERDI_LABELS,
};

export const KVALITETSVURDERING_ANKE_I_TR_AFTER_2027_CHECKBOX_GROUP_NAMES = OMGJØRING_ERROR_LABELS;
