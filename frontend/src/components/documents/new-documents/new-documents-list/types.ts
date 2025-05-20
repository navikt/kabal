import type {
  IFileDocument,
  IParentDocument,
  ISmartDocument,
  JournalfoertDokument,
} from '@app/types/documents/documents';

export interface DocumentWithAttachments {
  mainDocument?: IParentDocument;
  pdfOrSmartDocuments: (IFileDocument<string> | ISmartDocument<string>)[];
  journalfoerteDocuments: JournalfoertDokument[];
}
