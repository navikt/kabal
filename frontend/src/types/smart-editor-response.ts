import { ISmartEditorElement } from './smart-editor';

export interface ISmartEditorRawResponse {
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  json: string; // Parse to ISmartEditor.
  modified: string; // "2021-10-26T12:20:44.230Z"
}

export interface ISmartEditorResponse {
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  content: ISmartEditorElement[]; // Parsed from JSON string in ISmartEditorRawResponse.
  modified: string; // "2021-10-26T12:20:44.230Z"
}
