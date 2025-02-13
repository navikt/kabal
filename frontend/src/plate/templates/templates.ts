import { ANKEVEDTAK_TEMPLATE } from '@app/plate/templates/ankevedtak';
import { BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATE } from '@app/plate/templates/behandling-etter-tr-opphevet-vedtak';
import { FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_TEMPLATE } from '@app/plate/templates/forenklet-beslutning-om-ikke-å-omgjøre';
import { KLAGEVEDTAK_TEMPLATE } from '@app/plate/templates/klagevedtak';
import { OMGJØRINGSKRAVVEDTAK_TEMPLATE } from '@app/plate/templates/omgjøringskravvedtak';
import { ORIENTERING_OM_TILSVAR_TEMPLATE } from '@app/plate/templates/orientering-om-tilsvar-direkte-til-trygderetten';
import { OVERSENDELSESBREV_TEMPLATE } from '@app/plate/templates/oversendelsesbrev';
import {
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_ANSWERS_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  getGenereltBrevTemplate,
} from '@app/plate/templates/simple-templates';
import { SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE } from '@app/plate/templates/svar-på-innsynsbegjæring';
import { VARSEL_OM_OMGJØRING_TIL_UGUNST_TEMPLATE } from '@app/plate/templates/varsel-om-omgjøring-til-ugunst';

export const TEMPLATE_MAP = {
  [GENERELT_BREV_TEMPLATE.templateId]: GENERELT_BREV_TEMPLATE,
  [NOTAT_TEMPLATE.templateId]: NOTAT_TEMPLATE,
  [KLAGEVEDTAK_TEMPLATE.templateId]: KLAGEVEDTAK_TEMPLATE,
  [ANKEVEDTAK_TEMPLATE.templateId]: ANKEVEDTAK_TEMPLATE,
  [OVERSENDELSESBREV_TEMPLATE.templateId]: OVERSENDELSESBREV_TEMPLATE,
  [ROL_QUESTIONS_TEMPLATE.templateId]: ROL_QUESTIONS_TEMPLATE,
  [ROL_ANSWERS_TEMPLATE.templateId]: ROL_ANSWERS_TEMPLATE,
  [ROL_TILSVARSBREV_TEMPLATE.templateId]: ROL_TILSVARSBREV_TEMPLATE,
  [ORIENTERING_OM_TILSVAR_TEMPLATE.templateId]: ORIENTERING_OM_TILSVAR_TEMPLATE,
  [BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATE.templateId]: BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATE,
  [OMGJØRINGSKRAVVEDTAK_TEMPLATE.templateId]: OMGJØRINGSKRAVVEDTAK_TEMPLATE,
  [FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_TEMPLATE.templateId]: FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_TEMPLATE,
  [SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE.templateId]: SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
  [VARSEL_OM_OMGJØRING_TIL_UGUNST_TEMPLATE.templateId]: VARSEL_OM_OMGJØRING_TIL_UGUNST_TEMPLATE,
};

export const TEMPLATES = Object.values(TEMPLATE_MAP);

export const KLAGE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  KLAGEVEDTAK_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
  VARSEL_OM_OMGJØRING_TIL_UGUNST_TEMPLATE,
];

export const ANKE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ANKEVEDTAK_TEMPLATE,
  OVERSENDELSESBREV_TEMPLATE,
  ORIENTERING_OM_TILSVAR_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
];

export const ANKE_I_TRYGDERETTEN_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ORIENTERING_OM_TILSVAR_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
];

export const BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATES = [
  BEHANDLING_ETTER_TR_OPPHEVET_TEMPLATE,
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
];

export const OMGJØRINGSKRAVVEDTAK_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
  OMGJØRINGSKRAVVEDTAK_TEMPLATE,
  FORENKLET_BESLUTNING_OM_IKKE_Å_OMGJØRE_TEMPLATE,
  SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE,
];

export const getFinishedBehandlingTemplates = (navIdent: string) => {
  return [getGenereltBrevTemplate(false, navIdent), NOTAT_TEMPLATE, SVAR_PÅ_INNSYNSBEGJÆRING_TEMPLATE];
};
