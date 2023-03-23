import { Descendant } from 'slate';
import { deepFreeze } from '@app/functions/deep-freeze';
import { DocumentType } from '@app/types/documents/documents';
import { ISmartEditorTemplate, TemplateTypeEnum } from '@app/types/smart-editor/smart-editor';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';
import { VERSION } from '../../rich-text/version';
import { createCurrentDate, createFooter, createHeader, createSimpleParagraph } from './helpers';

const INITIAL_SLATE_VALUE: Descendant[] = [
  createCurrentDate(),
  createHeader(),
  createSimpleParagraph(),
  createFooter(),
];

export const GENERELT_BREV_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.GENERELT_BREV,
  type: TemplateTypeEnum.GENERELL,
  tittel: 'Generelt brev',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
  dokumentTypeId: DocumentType.BREV,
});

export const NOTAT_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  ...GENERELT_BREV_TEMPLATE,
  templateId: TemplateIdEnum.NOTAT,
  type: TemplateTypeEnum.NOTAT,
  tittel: 'Notat',
  dokumentTypeId: DocumentType.NOTAT,
});
