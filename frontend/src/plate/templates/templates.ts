import { ANKEVEDTAK_METADATA, ANKEVEDTAK_SECTIONS, getAnkevedtakTemplate } from '@/plate/templates/ankevedtak';
import {
  GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA,
  GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_SECTIONS,
  getGjenopptaksbegjæringEkspedisjonsbrevTilTrTemplate,
} from '@/plate/templates/begjæring-om-gjenopptak/ekspedisjonsbrev-til-tr';
import {
  GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_METADATA,
  GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_SECTIONS,
  getGjenopptaksbegjæringEttersendingTilTrTemplate,
} from '@/plate/templates/begjæring-om-gjenopptak/ettersending-til-tr';
import {
  GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA,
  GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_SECTIONS,
  getGjenopptaksbegjæringOrienteringOmTilsvarTemplate,
} from '@/plate/templates/begjæring-om-gjenopptak/orientering-om-tilsvar-direkte-til-tr';
import {
  GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_SECTIONS,
  GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_TITLE_SECTIONS,
  GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA,
  GJENOPPTAKSBEGJÆRING_TILSVARSBREV_SECTIONS,
  getGjenopptaksbegjæringTilsvarsbrevMedOversendelsesbrevTemplate,
} from '@/plate/templates/begjæring-om-gjenopptak/tilsvarsbrev-med-oversendelsesbrev';
import {
  GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA,
  GJENOPPTAKSBEGJÆRING_VEDTAK_SECTIONS,
  getGjenopptaksbegjæringVedtakTemplate,
} from '@/plate/templates/begjæring-om-gjenopptak/vedtak';
import {
  BEHANDLING_ETTER_TR_OPPHEVET_METADATA,
  BEHANDLING_ETTER_TR_OPPHEVET_SECTIONS,
  getBehandlingEtterTrOpphevetTemplate,
} from '@/plate/templates/behandling-etter-tr-opphevet-vedtak';
import {
  EKSPEDISJONSBREV_TIL_TRYGDERETTEN_METADATA,
  EKSPEDISJONSBREV_TIL_TRYGDERETTEN_SECTIONS,
  getEkspedisjonsbrevTilTrygderettenTemplate,
} from '@/plate/templates/ekspedisjonsbrev-til-trygderetten';
import {
  ETTERSENDING_TIL_TRYGDERETTEN_METADATA,
  ETTERSENDING_TIL_TRYGDERETTEN_SECTIONS,
  getEttersendingTilTrygderettenTemplate,
} from '@/plate/templates/ettersending-til-trygderetten';
import {
  FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA,
  FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_SECTIONS,
  getForenkletBeslutningOmIkkeÅOmgjøreTemplate,
} from '@/plate/templates/forenklet-beslutning-om-ikke-å-omgjøre';
import type { CreateTemplateParams } from '@/plate/templates/helpers';
import { getKlagevedtakTemplate, KLAGEVEDTAK_METADATA, KLAGEVEDTAK_SECTIONS } from '@/plate/templates/klagevedtak';
import {
  getOmgjøringskravvedtakTemplate,
  OMGJØRINGSKRAVVEDTAK_METADATA,
  OMGJØRINGSKRAVVEDTAK_SECTIONS,
} from '@/plate/templates/omgjøringskravvedtak';
import {
  getOrienteringOmTilsvarTemplate,
  ORIENTERING_OM_TILSVAR_METADATA,
  ORIENTERING_OM_TILSVAR_SECTIONS,
} from '@/plate/templates/orientering-om-tilsvar-direkte-til-trygderetten';
import {
  getOversendelsesbrevTemplate,
  OVERSENDELSESBREV_METADATA,
  OVERSENDELSESBREV_TILSVARSBREV_SECTIONS,
  OVERSENDELSESBREV_VEDTAK_SECTIONS,
} from '@/plate/templates/oversendelsesbrev';
import {
  GENERELT_BREV_METADATA,
  GENERELT_BREV_SECTIONS,
  getGenereltBrevTemplate,
  getNotatTemplate,
  getRolQuestionsTemplate,
  getRolTilsvarsbrevTemplate,
  NOTAT_METADATA,
  NOTAT_SECTIONS,
  ROL_ANSWERS_METADATA,
  ROL_ANSWERS_SECTIONS,
  ROL_QUESTIONS_METADATA,
  ROL_QUESTIONS_SECTIONS,
  ROL_TILSVARSBREV_METADATA,
  ROL_TILSVARSBREV_SECTIONS,
  ROL_TILSVARSBREV_VEDLEGG_SECTIONS,
} from '@/plate/templates/simple-templates';
import {
  getSvarPåInnsynsbegjæringTemplate,
  SVAR_PÅ_INNSYNSBEGJÆRING_METADATA,
  SVAR_PÅ_INNSYNSBEGJÆRING_SECTIONS,
} from '@/plate/templates/svar-på-innsynsbegjæring';
import {
  getTilForeleggelseTemplate,
  TIL_FORELEGGELSE_METADATA,
  TIL_FORELEGGELSE_SECTIONS,
} from '@/plate/templates/til-foreleggelse';
import {
  getVarselOmOmgjøringTilUgunstTemplate,
  VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA,
  VARSEL_OM_OMGJØRING_TIL_UGUNST_SECTIONS,
} from '@/plate/templates/varsel-om-omgjøring-til-ugunst';

// Metadata (templateId, tittel, dokumentTypeId, deprecatedSections) for every template, read straight from each
// template's own *_METADATA constant — never by calling the template factory, which needs case-specific params.
export const TEMPLATE_METADATA_MAP = {
  [GENERELT_BREV_METADATA.templateId]: GENERELT_BREV_METADATA,
  [NOTAT_METADATA.templateId]: NOTAT_METADATA,
  [KLAGEVEDTAK_METADATA.templateId]: KLAGEVEDTAK_METADATA,
  [ANKEVEDTAK_METADATA.templateId]: ANKEVEDTAK_METADATA,
  [OVERSENDELSESBREV_METADATA.templateId]: OVERSENDELSESBREV_METADATA,
  [ROL_QUESTIONS_METADATA.templateId]: ROL_QUESTIONS_METADATA,
  [ROL_ANSWERS_METADATA.templateId]: ROL_ANSWERS_METADATA,
  [ROL_TILSVARSBREV_METADATA.templateId]: ROL_TILSVARSBREV_METADATA,
  [ORIENTERING_OM_TILSVAR_METADATA.templateId]: ORIENTERING_OM_TILSVAR_METADATA,
  [BEHANDLING_ETTER_TR_OPPHEVET_METADATA.templateId]: BEHANDLING_ETTER_TR_OPPHEVET_METADATA,
  [OMGJØRINGSKRAVVEDTAK_METADATA.templateId]: OMGJØRINGSKRAVVEDTAK_METADATA,
  [FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA.templateId]: FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA,
  [SVAR_PÅ_INNSYNSBEGJÆRING_METADATA.templateId]: SVAR_PÅ_INNSYNSBEGJÆRING_METADATA,
  [VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA.templateId]: VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA,
  [EKSPEDISJONSBREV_TIL_TRYGDERETTEN_METADATA.templateId]: EKSPEDISJONSBREV_TIL_TRYGDERETTEN_METADATA,
  [ETTERSENDING_TIL_TRYGDERETTEN_METADATA.templateId]: ETTERSENDING_TIL_TRYGDERETTEN_METADATA,
  [GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA.templateId]: GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA,
  [GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA.templateId]:
    GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA,
  [GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA.templateId]:
    GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA,
  [GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA.templateId]:
    GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA,
  [GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_METADATA.templateId]: GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_METADATA,
  [TIL_FORELEGGELSE_METADATA.templateId]: TIL_FORELEGGELSE_METADATA,
};

export const TEMPLATE_METADATA_LIST = Object.values(TEMPLATE_METADATA_MAP);

// Which TemplateSections each template contains, read straight from each template's own *_SECTIONS constant(s) —
// the same constants used to build that template's actual richText, so this can never drift out of sync with what
// a template actually renders. Templates split across a page break or a second `createSaksinfo()` contribute more
// than one *_SECTIONS array, concatenated below.
export const TEMPLATE_SECTIONS_MAP = {
  [GENERELT_BREV_METADATA.templateId]: GENERELT_BREV_SECTIONS,
  [NOTAT_METADATA.templateId]: NOTAT_SECTIONS,
  [KLAGEVEDTAK_METADATA.templateId]: KLAGEVEDTAK_SECTIONS,
  [ANKEVEDTAK_METADATA.templateId]: ANKEVEDTAK_SECTIONS,
  [OVERSENDELSESBREV_METADATA.templateId]: [
    ...OVERSENDELSESBREV_TILSVARSBREV_SECTIONS,
    ...OVERSENDELSESBREV_VEDTAK_SECTIONS,
  ],
  [ROL_QUESTIONS_METADATA.templateId]: ROL_QUESTIONS_SECTIONS,
  [ROL_ANSWERS_METADATA.templateId]: ROL_ANSWERS_SECTIONS,
  [ROL_TILSVARSBREV_METADATA.templateId]: [...ROL_TILSVARSBREV_SECTIONS, ...ROL_TILSVARSBREV_VEDLEGG_SECTIONS],
  [ORIENTERING_OM_TILSVAR_METADATA.templateId]: ORIENTERING_OM_TILSVAR_SECTIONS,
  [BEHANDLING_ETTER_TR_OPPHEVET_METADATA.templateId]: BEHANDLING_ETTER_TR_OPPHEVET_SECTIONS,
  [OMGJØRINGSKRAVVEDTAK_METADATA.templateId]: OMGJØRINGSKRAVVEDTAK_SECTIONS,
  [FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_METADATA.templateId]: FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_SECTIONS,
  [SVAR_PÅ_INNSYNSBEGJÆRING_METADATA.templateId]: SVAR_PÅ_INNSYNSBEGJÆRING_SECTIONS,
  [VARSEL_OM_OMGJØRING_TIL_UGUNST_METADATA.templateId]: VARSEL_OM_OMGJØRING_TIL_UGUNST_SECTIONS,
  [EKSPEDISJONSBREV_TIL_TRYGDERETTEN_METADATA.templateId]: EKSPEDISJONSBREV_TIL_TRYGDERETTEN_SECTIONS,
  [ETTERSENDING_TIL_TRYGDERETTEN_METADATA.templateId]: ETTERSENDING_TIL_TRYGDERETTEN_SECTIONS,
  [GJENOPPTAKSBEGJÆRING_VEDTAK_METADATA.templateId]: GJENOPPTAKSBEGJÆRING_VEDTAK_SECTIONS,
  [GJENOPPTAKSBEGJÆRING_TILSVARSBREV_MED_OVERSENDELSESBREV_METADATA.templateId]: [
    ...GJENOPPTAKSBEGJÆRING_TILSVARSBREV_SECTIONS,
    ...GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_TITLE_SECTIONS,
    ...GJENOPPTAKSBEGJÆRING_OVERSENDELSESBREV_SECTIONS,
  ],
  [GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_METADATA.templateId]:
    GJENOPPTAKSBEGJÆRING_EKSPEDISJONSBREV_TIL_TR_SECTIONS,
  [GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_METADATA.templateId]:
    GJENOPPTAKSBEGJÆRING_ORIENTERING_OM_TILSVAR_SECTIONS,
  [GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_METADATA.templateId]: GJENOPPTAKSBEGJÆRING_ETTERSENDING_TIL_TR_SECTIONS,
  [TIL_FORELEGGELSE_METADATA.templateId]: TIL_FORELEGGELSE_SECTIONS,
};

export const getKlageTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getKlagevedtakTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
  getVarselOmOmgjøringTilUgunstTemplate(params),
];

export const getAnkeTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getAnkevedtakTemplate(params),
  getOversendelsesbrevTemplate(params),
  getEkspedisjonsbrevTilTrygderettenTemplate(params),
  getOrienteringOmTilsvarTemplate(params),
  getEttersendingTilTrygderettenTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
  getVarselOmOmgjøringTilUgunstTemplate(params),
];

export const getAnkeITrygderettenTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getEkspedisjonsbrevTilTrygderettenTemplate(params),
  getOrienteringOmTilsvarTemplate(params),
  getEttersendingTilTrygderettenTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
];

export const getBehandlingEtterTrOpphevetTemplates = (params: CreateTemplateParams) => [
  getBehandlingEtterTrOpphevetTemplate(params),
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
  getVarselOmOmgjøringTilUgunstTemplate(params),
];

export const getOmgjøringskravvedtakTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getOmgjøringskravvedtakTemplate(params),
  getForenkletBeslutningOmIkkeÅOmgjøreTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
  getVarselOmOmgjøringTilUgunstTemplate(params),
];

export const getBegjæringOmGjenopptakTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getGjenopptaksbegjæringVedtakTemplate(params),
  getGjenopptaksbegjæringTilsvarsbrevMedOversendelsesbrevTemplate(params),
  getGjenopptaksbegjæringEkspedisjonsbrevTilTrTemplate(params),
  getGjenopptaksbegjæringOrienteringOmTilsvarTemplate(params),
  getGjenopptaksbegjæringEttersendingTilTrTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
  getVarselOmOmgjøringTilUgunstTemplate(params),
];

export const getBegjæringOmGjenopptakITrTemplates = (params: CreateTemplateParams) => [
  getGenereltBrevTemplate(params),
  getNotatTemplate(params),
  getGjenopptaksbegjæringEkspedisjonsbrevTilTrTemplate(params),
  getGjenopptaksbegjæringOrienteringOmTilsvarTemplate(params),
  getGjenopptaksbegjæringEttersendingTilTrTemplate(params),
  getRolQuestionsTemplate(params),
  getRolTilsvarsbrevTemplate(params),
  getTilForeleggelseTemplate(params),
  getSvarPåInnsynsbegjæringTemplate(params),
];

interface GetFinishedBehandlingTemplatesParams extends CreateTemplateParams {
  navIdent: string;
}

export const getFinishedBehandlingTemplates = ({
  sakstype,
  fagsystemId,
  navIdent,
}: GetFinishedBehandlingTemplatesParams) => [
  getGenereltBrevTemplate({ sakstype, fagsystemId, overriddenSaksbehandler: navIdent }),
  getNotatTemplate({ sakstype, fagsystemId, overriddenSaksbehandler: navIdent }),
  getSvarPåInnsynsbegjæringTemplate({ sakstype, fagsystemId }),
];
