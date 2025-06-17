import type { IDocument, ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const getIsRolQuestions = (document: IDocument): document is ISmartDocument<null> =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS;

export const getIsRolAnswers = (document: IDocument): document is ISmartDocument<string> =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_ANSWERS;
