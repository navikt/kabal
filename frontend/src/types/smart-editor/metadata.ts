import { DistribusjonsType } from '../documents/documents';
import { TemplateIdEnum } from './template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
}
