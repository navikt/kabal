import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export type SelectedMap = Map<string, IJournalfoertDokumentId>;

export type SelectOne = (document: IJournalfoertDokumentId) => void;
export type SelectMany = (documents: IJournalfoertDokumentId[]) => void;
export type DocumentPath = [number, number];
export type SelectRange = (start: DocumentPath, end: DocumentPath) => void;

export interface ISelectContext {
  readonly selectedDocuments: SelectedMap;
  readonly selectedCount: number;
  readonly lastSelectedDocument: IJournalfoertDokumentId | null;
  readonly isSelected: (document: IJournalfoertDokumentId) => boolean;
  readonly selectOne: SelectOne;
  readonly unselectOne: (document: IJournalfoertDokumentId) => void;
  readonly selectMany: SelectMany;
  readonly unselectMany: (documents: IJournalfoertDokumentId[]) => void;
  readonly selectRangeTo: (document: IJournalfoertDokumentId) => void;
  readonly selectRange: SelectRange;
  readonly unselectAll: () => void;
  readonly getSelectedDocuments: () => IArkivertDocument[];
}

type SetSelectedDocuments = React.Dispatch<React.SetStateAction<SelectedMap>>;
type SetLastSelectedDocument = React.Dispatch<React.SetStateAction<IJournalfoertDokumentId | null>>;

export type SelectHook<T> = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
) => T;

export type SelectRangeToHook = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
  lastSelectedDocument: IJournalfoertDokumentId | null,
) => SelectOne;

export type SelectRangeHook = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
) => SelectRange;
