import { IDokument, IDokumentVedlegg } from '../../redux-api/dokumenter/types';

export interface ITilknyttetDokument {
  dokument: IDokument;
  tilknyttet: boolean;
}

export interface ITilknyttetVedlegg {
  vedlegg: IDokumentVedlegg;
  tilknyttet: boolean;
}
