import type { IDocumentParams } from '../documents/common-params';

export interface IDeleteCommentOrReplyParams extends IDocumentParams {
  commentId: string;
}

export interface IPatchCommentOrReplyParams extends IDeleteCommentOrReplyParams {
  text: string;
}

export interface IPostReplyParams extends IPatchCommentOrReplyParams {
  author: ICommentAuthor;
}

export interface IPostCommentParams extends IDocumentParams {
  author: ICommentAuthor;
  text: string;
}

export interface ISmartEditorComment {
  author: ICommentAuthor;
  comments: ISmartEditorComment[];
  created: string; // "2021-10-26T12:37:10.929Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  modified: string; // "2021-10-26T12:37:10.929Z",
  text: string;
}

interface ICommentAuthor {
  ident: string;
  name: string;
}
