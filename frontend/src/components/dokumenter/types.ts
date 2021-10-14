import { IDocument, IDocumentVedlegg } from '../../redux-api/documents-types';

export interface ITilknyttetDokument {
  document: IDocument;
  tilknyttet: boolean;
}

export interface ITilknyttetVedlegg {
  vedlegg: IDocumentVedlegg;
  tilknyttet: boolean;
}
