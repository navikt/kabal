import { IArkivertDocument, IArkivertDocumentVedlegg } from '../../types/arkiverte-documents';

export interface ITilknyttetDokument {
  document: IArkivertDocument;
  tilknyttet: boolean;
}

export interface ITilknyttetVedlegg {
  vedlegg: IArkivertDocumentVedlegg;
  tilknyttet: boolean;
}
