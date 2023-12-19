import { EditorValue } from '@app/plate/types';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { Role } from '../bruker';
import { TemplateIdEnum } from '../smart-editor/template-enums';
import { DokumentInfo, Journalpost } from './../arkiverte-documents';

export type UUID = string;

export enum DocumentTypeEnum {
  SMART = 'SMART',
  UPLOADED = 'UPLOADED',
  JOURNALFOERT = 'JOURNALFOERT',
  VEDLEGGSOVERSIKT = 'VEDLEGGSOVERSIKT',
}

export const DOCUMENT_TYPE_NAMES: Record<DocumentTypeEnum, string> = {
  [DocumentTypeEnum.SMART]: 'Smartdokument',
  [DocumentTypeEnum.UPLOADED]: 'Opplastet dokument',
  [DocumentTypeEnum.JOURNALFOERT]: 'Journalført dokument',
  [DocumentTypeEnum.VEDLEGGSOVERSIKT]: 'Vedleggsoversikt',
};

export enum DistribusjonsType {
  BREV = '1',
  NOTAT = '2',
  VEDTAKSBREV = '4',
  BESLUTNING = '5',
  KJENNELSE_FRA_TRYGDERETTEN = '6',
}

export const DISTRIBUTION_TYPE_NAMES: Record<DistribusjonsType, string> = {
  [DistribusjonsType.VEDTAKSBREV]: 'Vedtaksbrev',
  [DistribusjonsType.BESLUTNING]: 'Beslutningsbrev',
  [DistribusjonsType.BREV]: 'Brev',
  [DistribusjonsType.NOTAT]: 'Notat',
  [DistribusjonsType.KJENNELSE_FRA_TRYGDERETTEN]: 'Kjennelse fra Trygderetten',
};

interface IBaseDocument<P extends string | null = UUID | null> {
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
  parentId: P;
  creatorIdent: string;
  creatorRole: Role;
}

export interface IFileDocument<P extends string | null = UUID | null> extends IBaseDocument<P> {
  type: DocumentTypeEnum.UPLOADED;
  isSmartDokument: false;
  templateId?: never;
  content?: never;
  datoMottatt: string | null;
}

export interface ISmartDocument<P extends string | null = UUID | null> extends IBaseDocument<P> {
  type: DocumentTypeEnum.SMART;
  isSmartDokument: true;
  templateId: TemplateIdEnum;
  content: EditorValue;
}

interface IJournalfoertDokument
  extends IJournalfoertDokumentId,
    Pick<DokumentInfo, 'harTilgangTilArkivvariant'>,
    Pick<Journalpost, 'datoOpprettet'> {
  sortKey: string;
}

export interface IJournalfoertDokumentReference extends IBaseDocument<UUID> {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: IJournalfoertDokument;
  isSmartDokument: false;
  templateId?: never;
  content?: never;
}

export type IMainDocument = IFileDocument | ISmartDocument | IJournalfoertDokumentReference;

export type IParentDocument = IFileDocument<null> | ISmartDocument<null>;

export interface IMergedDocumentsResponse {
  reference: string;
  title: string;
}
