export enum DocumentTypeEnum {
  SMART = 'SMART',
  FILE = 'FILE',
  ARCHIVED = 'ARCHIVED',
}

export interface IShownNewDocument {
  documentId: string;
  title: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.FILE;
}

export interface IShownArchivedDocument {
  dokumentInfoId: string;
  journalpostId: string;
  title: string;
  type: DocumentTypeEnum.ARCHIVED;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
