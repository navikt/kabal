import type { Path } from '@app/components/documents/journalfoerte-documents/select-context/range-utils';
import type { IArkivertDocument } from '@app/types/arkiverte-documents';
import type { IJournalfoertDokumentId } from '@app/types/oppgave-common';

export type SelectedMap = Map<string, IJournalfoertDokumentId>;

export type SelectOne = (documentIndex: number, attachmentIndex?: number) => void;
export type SelectMany = (documentPaths: Path[]) => void;
export type SelectRange = (start: Path, end: Path) => void;

export interface ISelectContext {
  readonly selectedDocuments: SelectedMap;
  readonly selectableCount: number;
  readonly lastSelectedDocument: IJournalfoertDokumentId | null;
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
