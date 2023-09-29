import { ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

interface Params {
  isSmartDokument: boolean;
  templateId?: ISmartDocument['templateId'];
}

export const getIsRolQuestions = (document: Params): boolean =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS;
