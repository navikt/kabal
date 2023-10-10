import { Role } from '../bruker';
import { TemplateIdEnum } from '../smart-editor/template-enums';
import { DokumentInfo, Journalpost } from './../arkiverte-documents';

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
  /**
   * The date and time the document was created.
   *
   * @format LocalDateTime
   */
  created: string; // LocalDateTime
  /**
   * The date and time the smart document was last modified.
   * For all other documents, this is the same as `created`.
   *
   * @format LocalDateTime
   */
  modified: string;
  isSmartDokument: boolean;
  isMarkertAvsluttet: boolean;
  parentId: UUID | null;
  creatorIdent: string;
  creatorRole: Role;
}

export interface IFileDocument extends IBaseDocument {
  type: DocumentTypeEnum.UPLOADED;
  isSmartDokument: false;
  templateId: null;
}

export interface ISmartDocument extends IBaseDocument {
  type: DocumentTypeEnum.SMART;
  isSmartDokument: true;
  templateId: TemplateIdEnum;
}

export interface IJournalfoertDokumentId
  extends Pick<Journalpost, 'journalpostId'>,
    Pick<DokumentInfo, 'dokumentInfoId'> {}

export interface IJournalfoertDokument
  extends IJournalfoertDokumentId,
    Pick<DokumentInfo, 'harTilgangTilArkivvariant'>,
    Pick<Journalpost, 'datoOpprettet'> {}

export interface IJournalfoertDokumentReference extends IBaseDocument {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: IJournalfoertDokument;
  isSmartDokument: false;
  parentId: UUID;
  templateId?: never;
}

export type IMainDocument = IFileDocument | ISmartDocument | IJournalfoertDokumentReference;

export interface IMergedDocumentsResponse {
  reference: string;
  title: string;
}
