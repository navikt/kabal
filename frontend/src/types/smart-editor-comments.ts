import { IDocumentParams } from './documents-common-params';

export interface IGetCommentParams extends IDocumentParams {
  commentId: string;
}

export interface IPostCommentParams extends IDocumentParams {
  author: ICommentAuthor;
  text: string;
}

export interface IPostReplyParams extends IPostCommentParams {
  commentId: string;
}

export interface ISmartEditorComment extends IPostCommentParams {
  author: ICommentAuthor;
  comments: ISmartEditorComment[];
  created: string; // "2021-10-26T12:37:10.929Z",
  id: string; // "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  modified: string; // "2021-10-26T12:37:10.929Z",
  text: string;
}

export interface ICommentAuthor {
  ident: string;
  name: string;
}
