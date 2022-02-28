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
}

export interface ISmartDocument extends IBaseDocument {
  isSmartDokument: true;
}

export interface IParentDocument extends IBaseDocument {
  parent: null;
}

export interface IAttachmentDocument extends IBaseDocument {
  parent: UUID;
}

export type IMainDocument = (IFileDocument | ISmartDocument) & (IParentDocument | IAttachmentDocument);
