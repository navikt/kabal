import type { IMainDocument, ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const getIsRolQuestions = (document: IMainDocument): document is ISmartDocument =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS;
