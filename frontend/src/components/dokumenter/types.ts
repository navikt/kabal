import { IDocument, IDocumentVedlegg } from '../../types/documents';

export interface ITilknyttetDokument {
  document: IDocument;
  tilknyttet: boolean;
}

export interface ITilknyttetVedlegg {
  vedlegg: IDocumentVedlegg;
  tilknyttet: boolean;
}
