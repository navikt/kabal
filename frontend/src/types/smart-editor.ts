import { Descendant } from 'slate';

export interface INewSmartEditor {
  tittel: string; // ex. "Vedtak om klagebehandling 123".
  content: ISmartEditorElement[];
}

export interface ISmartEditor extends INewSmartEditor {
  id: string; // UUID from backend.
}

export interface ISmartEditorTemplate extends INewSmartEditor {
  templateId: string;
}

interface IBaseSmartEditorElement {
  id: string;
  label: string; // ex. "Vedtak / Beslutning".
}

export type ISmartEditorElement = IRichTextElement | ITextElement;

export interface IRichTextElement extends IBaseSmartEditorElement {
  type: 'rich-text';
  content: Descendant[];
}

export interface ITextElement extends IBaseSmartEditorElement {
  type: 'text';
  content: string;
}

export interface ISmartEditorRawResponse {
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  json: string; // Parse to ISmartEditor.
  modified: string; // "2021-10-26T12:20:44.230Z"
}

export interface ISmartEditorResponse {
  created: string; // "2021-10-26T12:20:44.230Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  smartEditorData: ISmartEditor; // Parsed from JSON string in ISmartEditorRawResponse.
  modified: string; // "2021-10-26T12:20:44.230Z"
}

export interface IGetCommentParams {
  documentId: string;
  commentId: string;
}

export interface ICommentAuthor {
  ident: string;
  name: string;
}

export interface ISmartEditorCommentRequest {
  author: ICommentAuthor;
  text: string;
  documentId: string;
}

export interface ISmartEditorCommentReply extends ISmartEditorCommentRequest {
  threadId: string;
}

export interface ISmartEditorComment extends ISmartEditorCommentRequest {
  author: ICommentAuthor;
  comments: ISmartEditorComment[];
  created: string; // "2021-10-26T12:37:10.929Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  modified: string; // "2021-10-26T12:37:10.929Z",
  text: string;
}
