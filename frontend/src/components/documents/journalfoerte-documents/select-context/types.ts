import { IArkivertDocument } from '@app/types/arkiverte-documents';

export interface IArkivertDocumentReference {
  readonly journalpostId: string;
  readonly dokumentInfoId: string;
}

export type SelectedMap = Map<string, IArkivertDocumentReference>;

export interface ISelectContext {
  readonly selectedDocuments: SelectedMap;
  readonly selectedCount: number;
  readonly lastSelectedDocument: IArkivertDocumentReference | null;
  readonly isSelected: (document: IArkivertDocumentReference) => boolean;
  readonly selectOne: (document: IArkivertDocumentReference) => void;
  readonly unselectOne: (document: IArkivertDocumentReference) => void;
  readonly selectMany: (documents: IArkivertDocumentReference[]) => void;
  readonly unselectMany: (documents: IArkivertDocumentReference[]) => void;
  readonly selectRangeTo: (document: IArkivertDocumentReference) => void;
  readonly unselectAll: () => void;
  readonly getSelectedDocuments: () => IArkivertDocument[];
}

export type SelectOne = (document: IArkivertDocumentReference) => void;
export type SelectMany = (documents: IArkivertDocumentReference[]) => void;

type SetSelectedDocuments = React.Dispatch<React.SetStateAction<SelectedMap>>;
type SetLastSelectedDocument = React.Dispatch<React.SetStateAction<IArkivertDocumentReference | null>>;

export type SelectHook<T> = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
) => T;

export type SelectRangeHook = (
  setSelectedDocuments: SetSelectedDocuments,
  setLastSelectedDocument: SetLastSelectedDocument,
  documentList: IArkivertDocument[],
  lastSelectedDocument: IArkivertDocumentReference | null,
) => SelectOne;
