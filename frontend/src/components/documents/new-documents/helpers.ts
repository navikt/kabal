import type { IDocument, ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export type MaybeRolQuestionsDocument = Pick<IDocument, 'isSmartDokument' | 'templateId'>;

export const getIsRolQuestions = (document: MaybeRolQuestionsDocument): document is ISmartDocument<null> =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_QUESTIONS;

export type MaybeRolAnswersDocument = Pick<IDocument, 'isSmartDokument' | 'templateId'>;

export const getIsRolAnswers = (document: MaybeRolAnswersDocument): document is ISmartDocument<string> =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_ANSWERS;
