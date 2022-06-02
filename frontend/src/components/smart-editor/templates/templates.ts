import { OppgaveType } from '../../../types/kodeverk';
import { TemplateTypeEnum } from '../../../types/smart-editor/smart-editor';
import { ANKEVEDTAK_TEMPLATE } from './ankevedtak';
import { EMPTY_TEMPLATE } from './empty';
import { KLAGEVEDTAK_TEMPLATE } from './klagevedtak';
import { KLAGEVEDTAK_LEGACY_TEMPLATE } from './klagevedtak-legacy';

export const TEMPLATES = [EMPTY_TEMPLATE, KLAGEVEDTAK_LEGACY_TEMPLATE, KLAGEVEDTAK_TEMPLATE, ANKEVEDTAK_TEMPLATE];

export const KLAGE_TEMPLATES = TEMPLATES.filter(
  ({ type }) => type === OppgaveType.KLAGE || type === TemplateTypeEnum.GENERELL
);

export const ANKE_TEMPLATES = TEMPLATES.filter(
  ({ type }) => type === OppgaveType.ANKE || type === TemplateTypeEnum.GENERELL
);

export const EXPERIMENTAL_TEMPLATES = [KLAGEVEDTAK_TEMPLATE, ANKEVEDTAK_TEMPLATE];

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.templateId);