import { VERSION } from '../../components/rich-text/version';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

export type UUID = string;

export enum DocumentType {
  BREV = '1',
  NOTAT = '2',
  VEDTAKSBREV = '4',
  BESLUTNING = '5',
}

export interface IBaseDocument {
  id: UUID;
  tittel: string;
  dokumentTypeId: DocumentType;
  opplastet: string; // LocalDateTime,
  isSmartDokument: boolean;
  isMarkertAvsluttet: boolean;
  parent: UUID | null;
}

export interface IFileDocument extends IBaseDocument {
  isSmartDokument: false;
  templateId: null;
}

export interface ISmartDocument extends IBaseDocument {
  isSmartDokument: true;
  templateId: TemplateIdEnum | NoTemplateIdEnum | null; // Nullable until all smart documents without this are finished. Make not nullable once all legacy smart documents are finished.
  version?: typeof VERSION;
}

export type IMainDocument = IFileDocument | ISmartDocument;
