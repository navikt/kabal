import { Descendant } from 'slate';

export interface ISmartEditorRawResponse extends ISmartEditorBaseResponse {
  json: string; // Parse to ISmartEditor.
}

export interface ISmartEditorResponse extends ISmartEditorBaseResponse {
  content: Descendant[]; // Parsed from JSON string in ISmartEditorRawResponse.
}

export interface ISmartEditorBaseResponse extends ISmartEditorPatchResponse {
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  modified: string; // "2021-10-26T12:20:44.230Z"
}

export interface ISmartEditorPatchResponse {
  patchVersion: number; // TODO: Replace with CRDT response.
}
