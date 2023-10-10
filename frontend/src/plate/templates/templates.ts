import { ENVIRONMENT } from '@app/environment';
import { OVERSENDELSESBREV_TEMPLATE } from '@app/plate/templates/oversendelsesbrev';
import { ANKEVEDTAK_TEMPLATE } from './ankevedtak';
import { KLAGEVEDTAK_TEMPLATE } from './klagevedtak';
import {
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_ANSWERS_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
} from './simple-templates';

export const TEMPLATE_MAP = {
  [GENERELT_BREV_TEMPLATE.templateId]: GENERELT_BREV_TEMPLATE,
  [NOTAT_TEMPLATE.templateId]: NOTAT_TEMPLATE,
  [KLAGEVEDTAK_TEMPLATE.templateId]: KLAGEVEDTAK_TEMPLATE,
  [ANKEVEDTAK_TEMPLATE.templateId]: ANKEVEDTAK_TEMPLATE,
  [OVERSENDELSESBREV_TEMPLATE.templateId]: OVERSENDELSESBREV_TEMPLATE,
  [ROL_QUESTIONS_TEMPLATE.templateId]: ROL_QUESTIONS_TEMPLATE,
  [ROL_ANSWERS_TEMPLATE.templateId]: ROL_ANSWERS_TEMPLATE,
  [ROL_TILSVARSBREV_TEMPLATE.templateId]: ROL_TILSVARSBREV_TEMPLATE,
};

export const TEMPLATES = Object.values(TEMPLATE_MAP);

// TODO: Remove ternary when ROL is done.
export const KLAGE_TEMPLATES = ENVIRONMENT.isProduction
  ? [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE, KLAGEVEDTAK_TEMPLATE]
  : [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE, KLAGEVEDTAK_TEMPLATE, ROL_QUESTIONS_TEMPLATE, ROL_TILSVARSBREV_TEMPLATE];

// TODO: Remove ternary when ROL is done / redaktør texts are ready.
export const ANKE_TEMPLATES = ENVIRONMENT.isProduction
  ? [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE]
  : [
      GENERELT_BREV_TEMPLATE,
      NOTAT_TEMPLATE,
      ANKEVEDTAK_TEMPLATE,
      OVERSENDELSESBREV_TEMPLATE,
      ROL_QUESTIONS_TEMPLATE,
      ROL_TILSVARSBREV_TEMPLATE,
    ];

export const ANKE_I_TRYGDERETTEN_TEMPLATES = [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE];
