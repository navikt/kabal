import { VERSION } from '@app/components/rich-text/version';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

export type UUID = string;

export enum DocumentTypeEnum {
  SMART = 'SMART',
  UPLOADED = 'UPLOADED',
  JOURNALFOERT = 'JOURNALFOERT',
}

export enum DistribusjonsType {
  BREV = '1',
  NOTAT = '2',
  VEDTAKSBREV = '4',
  BESLUTNING = '5',
}

interface IBaseDocument {
  type: DocumentTypeEnum;
  id: UUID;
  tittel: string;
  dokumentTypeId: DistribusjonsType;
  newOpplastet: string; // LocalDateTime,
  isSmartDokument: boolean;
  isMarkertAvsluttet: boolean;
  parentId: UUID | null;
}

export interface IFileDocument extends IBaseDocument {
  type: DocumentTypeEnum.UPLOADED;
  isSmartDokument: false;
  templateId: null;
}

interface ISmartDocument extends IBaseDocument {
  type: DocumentTypeEnum.SMART;
  isSmartDokument: true;
  templateId: TemplateIdEnum | NoTemplateIdEnum | null; // Nullable until all smart documents without this are finished. Make not nullable once all legacy smart documents are finished.
  version?: typeof VERSION;
}

export interface IJournalfoertDokumentReference {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IJournalfoertDokument extends IBaseDocument {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: IJournalfoertDokumentReference;
  isSmartDokument: false;
  parentId: UUID;
}

export type IMainDocument = IFileDocument | ISmartDocument | IJournalfoertDokument;

export enum IncludedDocumentFilter {
  INCLUDED = 'included',
  EXCLUDED = 'excluded',
  ALL = 'all',
}

export interface IMergedDocumentsResponse {
  reference: string;
}
