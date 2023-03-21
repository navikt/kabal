export enum DocumentTypeEnum {
  SMART = 'SMART',
  FILE = 'FILE',
  ARCHIVED = 'ARCHIVED',
}

interface IShownNewDocument {
  documentId: string;
  type: DocumentTypeEnum.SMART | DocumentTypeEnum.FILE;
}

interface IShownArchivedDocument {
  dokumentInfoId: string;
  journalpostId: string;
  type: DocumentTypeEnum.ARCHIVED;
}

export type IShownDocument = IShownNewDocument | IShownArchivedDocument;
