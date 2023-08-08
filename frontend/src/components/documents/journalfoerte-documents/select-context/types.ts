import { IJournalpostDocument } from '@app/types/arkiverte-documents';
import { IJournalpostReference } from '@app/types/documents/documents';

export interface ISelectedDocument {
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

export type SelectedMap = Record<string, ISelectedDocument>;

export interface ISelectContext {
  readonly selectedDocuments: SelectedMap;
  readonly lastSelectedDocument: ISelectedDocument | null;
  isSelected: (document: ISelectedDocument) => boolean;
  selectOne: (document: ISelectedDocument) => void;
  unselectOne: (document: ISelectedDocument) => void;
  selectMany: (documents: ISelectedDocument[]) => void;
  unselectMany: (documents: ISelectedDocument[]) => void;
  selectRangeTo: (document: ISelectedDocument) => void;
  unselectAll: () => void;
  getSelectedDocuments: () => Promise<IJournalpostDocument[]>;
}

export type SelectOne = (document: ISelectedDocument) => void;
export type SelectMany = (documents: ISelectedDocument[]) => void;

type SetSelectedDocuments = React.Dispatch<React.SetStateAction<SelectedMap>>;
type SetLastSelectedDocument = React.Dispatch<React.SetStateAction<ISelectedDocument | null>>;

export type SelectHook<T> = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
) => T;

export type SelectRangeHook = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IJournalpostReference[],
  lastSelectedDocument: ISelectedDocument | null,
) => SelectOne;
