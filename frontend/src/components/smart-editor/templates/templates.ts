import { SaksTypeEnum } from '../../../types/kodeverk';
import { TemplateTypeEnum } from '../../../types/smart-editor/smart-editor';
import { ANKEVEDTAK_TEMPLATE } from './ankevedtak';
import { GENERELT_BREV_TEMPLATE } from './generelt-brev';
import { KLAGEVEDTAK_TEMPLATE } from './klagevedtak';

export const TEMPLATES = [GENERELT_BREV_TEMPLATE, KLAGEVEDTAK_TEMPLATE, ANKEVEDTAK_TEMPLATE];

export const KLAGE_TEMPLATES = TEMPLATES.filter(
  ({ type }) => type === SaksTypeEnum.KLAGE || type === TemplateTypeEnum.GENERELL
);

export const ANKE_TEMPLATES = TEMPLATES.filter(
  ({ type }) => type === SaksTypeEnum.ANKE || type === TemplateTypeEnum.GENERELL
);

export const TEMPLATE_IDS = TEMPLATES.map((t) => t.templateId);
