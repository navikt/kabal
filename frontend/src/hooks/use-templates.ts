import { FeatureToggles, useFeatureToggle } from '@app/hooks/use-feature-toggle';
import { ANKEVEDTAK_TEMPLATE } from '@app/plate/templates/ankevedtak';
import { KLAGEVEDTAK_TEMPLATE } from '@app/plate/templates/klagevedtak';
import { KLAGEVEDTAK_OLD_TEMPLATE } from '@app/plate/templates/klagevedtak-old';
import { OVERSENDELSESBREV_TEMPLATE } from '@app/plate/templates/oversendelsesbrev';
import {
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_ANSWERS_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
} from '@app/plate/templates/simple-templates';
import { IMutableSmartEditorTemplate } from '@app/types/smart-editor/smart-editor';
import { Immutable } from '@app/types/types';

export interface ITemplates {
  templates: Immutable<IMutableSmartEditorTemplate>[];
  klageTemplates: Immutable<IMutableSmartEditorTemplate>[];
  ankeTemplates: Immutable<IMutableSmartEditorTemplate>[];
  ankeITrygderettenTemplates: Immutable<IMutableSmartEditorTemplate>[];
}

export const useTemplates = (): ITemplates => {
  const enabled = useFeatureToggle(FeatureToggles.MALTEKSTSEKSJONER);

  if (enabled) {
    return {
      templates: FULL_TEMPLATES,
      klageTemplates: FULL_KLAGE_TEMPLATES,
      ankeTemplates: FULL_ANKE_TEMPLATES,
      ankeITrygderettenTemplates: ANKE_I_TRYGDERETTEN_TEMPLATES,
    };
  }

  return {
    templates: LEGACY_TEMPLATES,
    klageTemplates: LEGACY_KLAGE_TEMPLATES,
    ankeTemplates: LEGACY_ANKE_TEMPLATES,
    ankeITrygderettenTemplates: ANKE_I_TRYGDERETTEN_TEMPLATES,
  };
};

export const TEMPLATE_MAP = {
  [GENERELT_BREV_TEMPLATE.templateId]: GENERELT_BREV_TEMPLATE,
  [NOTAT_TEMPLATE.templateId]: NOTAT_TEMPLATE,
  [KLAGEVEDTAK_TEMPLATE.templateId]: KLAGEVEDTAK_TEMPLATE,
  [KLAGEVEDTAK_OLD_TEMPLATE.templateId]: KLAGEVEDTAK_OLD_TEMPLATE,
  [ANKEVEDTAK_TEMPLATE.templateId]: ANKEVEDTAK_TEMPLATE,
  [OVERSENDELSESBREV_TEMPLATE.templateId]: OVERSENDELSESBREV_TEMPLATE,
  [ROL_QUESTIONS_TEMPLATE.templateId]: ROL_QUESTIONS_TEMPLATE,
  [ROL_ANSWERS_TEMPLATE.templateId]: ROL_ANSWERS_TEMPLATE,
  [ROL_TILSVARSBREV_TEMPLATE.templateId]: ROL_TILSVARSBREV_TEMPLATE,
};

const FULL_TEMPLATES = Object.values(TEMPLATE_MAP);

const LEGACY_TEMPLATES = Object.values(TEMPLATE_MAP).filter(
  ({ templateId }) =>
    templateId !== KLAGEVEDTAK_TEMPLATE.templateId &&
    templateId !== ANKEVEDTAK_TEMPLATE.templateId &&
    templateId !== OVERSENDELSESBREV_TEMPLATE.templateId,
);

const LEGACY_KLAGE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  KLAGEVEDTAK_OLD_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
];

const FULL_KLAGE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  KLAGEVEDTAK_TEMPLATE,
  KLAGEVEDTAK_OLD_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
];

const LEGACY_ANKE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
];

const FULL_ANKE_TEMPLATES = [
  GENERELT_BREV_TEMPLATE,
  NOTAT_TEMPLATE,
  ANKEVEDTAK_TEMPLATE,
  OVERSENDELSESBREV_TEMPLATE,
  ROL_QUESTIONS_TEMPLATE,
  ROL_TILSVARSBREV_TEMPLATE,
];

const ANKE_I_TRYGDERETTEN_TEMPLATES = [GENERELT_BREV_TEMPLATE, NOTAT_TEMPLATE];
