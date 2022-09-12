import { Descendant } from 'slate';
import { deepFreeze } from '../../../functions/deep-freeze';
import { DocumentType } from '../../../types/documents/documents';
import { ISmartEditorTemplate, TemplateTypeEnum } from '../../../types/smart-editor/smart-editor';
import { TemplateIdEnum } from '../../../types/smart-editor/template-enums';
import { VERSION } from '../../rich-text/version';
import { createSimpleParagraph } from './helpers';

const INITIAL_SLATE_VALUE: Descendant[] = [createSimpleParagraph()];

export const EMPTY_TEMPLATE = deepFreeze<ISmartEditorTemplate>({
  templateId: TemplateIdEnum.EMPTY,
  type: TemplateTypeEnum.GENERELL,
  tittel: 'Generelt brev',
  content: INITIAL_SLATE_VALUE,
  version: VERSION,
  dokumentTypeId: DocumentType.BREV,
});
