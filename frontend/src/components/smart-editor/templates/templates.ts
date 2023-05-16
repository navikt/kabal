import { ANKEVEDTAK_TEMPLATE } from './ankevedtak';
import { KLAGEVEDTAK_TEMPLATE } from './klagevedtak';
import { GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE } from './simple-templates';

export const TEMPLATES = [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE, KLAGEVEDTAK_TEMPLATE, ANKEVEDTAK_TEMPLATE];

export const KLAGE_TEMPLATES = [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE, KLAGEVEDTAK_TEMPLATE];

export const ANKE_TEMPLATES = [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE, ANKEVEDTAK_TEMPLATE];

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.templateId);