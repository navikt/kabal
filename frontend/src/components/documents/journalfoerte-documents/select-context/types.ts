import { IArkivertDocument } from '@app/types/arkiverte-documents';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export type SelectedMap = Map<string, IJournalfoertDokumentId>;

export interface ISelectContext {
  readonly selectedDocuments: SelectedMap;
  readonly selectedCount: number;
  readonly lastSelectedDocument: IJournalfoertDokumentId | null;
  readonly isSelected: (document: IJournalfoertDokumentId) => boolean;
  readonly selectOne: (document: IJournalfoertDokumentId) => void;
  readonly unselectOne: (document: IJournalfoertDokumentId) => void;
  readonly selectMany: (documents: IJournalfoertDokumentId[]) => void;
  readonly unselectMany: (documents: IJournalfoertDokumentId[]) => void;
  readonly selectRangeTo: (document: IJournalfoertDokumentId) => void;
  readonly unselectAll: () => void;
  readonly getSelectedDocuments: () => IArkivertDocument[];
}

export type SelectOne = (document: IJournalfoertDokumentId) => void;
export type SelectMany = (documents: IJournalfoertDokumentId[]) => void;

type SetSelectedDocuments = React.Dispatch<React.SetStateAction<SelectedMap>>;
type SetLastSelectedDocument = React.Dispatch<React.SetStateAction<IJournalfoertDokumentId | null>>;

export type SelectHook<T> = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
) => T;

export type SelectRangeHook = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
  lastSelectedDocument: IJournalfoertDokumentId | null,
) => SelectOne;
