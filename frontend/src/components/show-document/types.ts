export enum DocumentTypeEnum {
  SMART = 'SMART',
  FILE = 'FILE',
  ARCHIVED = 'ARCHIVED',
}

interface IShownNewDocument {
  documentId: string;
  title: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.FILE;
}

interface IShownArchivedDocument {
  dokumentInfoId: string;
  journalpostId: string;
  title: string;
  type: DocumentTypeEnum.ARCHIVED;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
