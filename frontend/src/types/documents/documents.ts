import { VERSION } from '@app/components/rich-text/version';
import { AvsenderMottaker, Journalposttype, Sak } from '@app/types/arkiverte-documents';
import { NoTemplateIdEnum, TemplateIdEnum } from '../smart-editor/template-enums';

export type UUID = string;

export enum DocumentTypeEnum {
  SMART = 'SMART',
  UPLOADED = 'UPLOADED',
  JOURNALFOERT = 'JOURNALFOERT',
}

export const DOCUMENT_TYPE_NAMES: Record<DocumentTypeEnum, string> = {
  [DocumentTypeEnum.SMART]: 'Smartdokument',
  [DocumentTypeEnum.UPLOADED]: 'Opplastet dokument',
  [DocumentTypeEnum.JOURNALFOERT]: 'Journalført dokument',
};

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
  created: string; // LocalDateTime,
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

export interface IJournalfoertDokumentId {
  journalpostId: string;
  dokumentInfoId: string;
}

export interface IJournalfoertDokumentReference extends IBaseDocument {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: IJournalfoertDokumentId;
  isSmartDokument: false;
  parentId: UUID;
}

export type IMainDocument = IFileDocument | ISmartDocument | IJournalfoertDokumentReference;

export interface IMergedDocumentsResponse {
  reference: string;
  title: string;
}

export interface IJournalpostReference {
  journalpostId: string;
  dokumentInfoId: string;
  vedlegg: string[];
}

export interface IJournalpostIdListParams {
  oppgaveId: string;
  temaIdList?: string[];
  journalposttyper?: Journalposttype[];
}

export interface IJournalpostIdListResponse {
  journalpostList: IJournalpostReference[];
  journalpostCount: number;
  vedleggCount: number;
  avsenderMottakerList: AvsenderMottaker[];
  sakList: Sak[];
}
