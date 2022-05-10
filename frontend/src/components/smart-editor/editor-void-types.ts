import { VoidElementsEnum } from './editor-enums';

interface IWithThreads {
  threadIds: string[];
}

interface IBaseVoid {
  children: [{ text: '' }];
}

export interface SignatureElementType extends ISignatureContent, IBaseVoid, IWithThreads {
  type: VoidElementsEnum.SIGNATURE;
}

export interface ISignature {
  name: string;
  title: string;
}

export interface ISignatureContent {
  useShortName: boolean;
  saksbehandler?: ISignature;
  medunderskriver?: ISignature;
}
export interface LabelContentElementType extends IBaseVoid, IWithThreads {
  type: VoidElementsEnum.LABEL_CONTENT;
  label: string;
  source: string;
  result?: string;
}

export interface IDocumentItem {
  id: string;
  title: string;
}

export interface DocumentListElementType extends IBaseVoid, IWithThreads {
  type: VoidElementsEnum.DOCUMENT_LIST;
  documents: IDocumentItem[];
}

export interface CurrentDateType extends IBaseVoid {
  type: VoidElementsEnum.CURRENT_DATE;
}

export type VoidTypes = SignatureElementType | LabelContentElementType | DocumentListElementType | CurrentDateType;

export type CommentableVoidElementTypes = SignatureElementType | LabelContentElementType | DocumentListElementType;

export type VoidElementTypes = CommentableVoidElementTypes | CurrentDateType;
