import { IMainDocument, ISmartDocument } from '@app/types/documents/documents';
import { TemplateIdEnum } from '@app/types/smart-editor/template-enums';

export const isRolNotat = (document: IMainDocument): document is ISmartDocument =>
  document.isSmartDokument && document.templateId === TemplateIdEnum.ROL_NOTAT;
