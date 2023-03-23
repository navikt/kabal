import { VERSION } from '@app/components/rich-text/version';
import { DocumentType, UUID } from '../documents/documents';
import { NoTemplateIdEnum, TemplateIdEnum } from './template-enums';

export interface INewSmartEditorMetadata {
  templateId: TemplateIdEnum;
  tittel: string;
  version: typeof VERSION;
  dokumentTypeId: DocumentType;
}

export interface ISmartEditorMetadata extends Omit<INewSmartEditorMetadata, 'templateId' | 'version'> {
  templateId: TemplateIdEnum | NoTemplateIdEnum; // TODO: Remove this enum once all smart documents are migrated to v1.
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  modified: string; // "2021-10-26T12:20:44.230Z"
  parent: UUID | null;
}
