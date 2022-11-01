import { DeletableVoidElementsEnum, UndeletableVoidElementsEnum } from './editor-enums';
import { IMarks } from './marks';

interface IWithThreads {
  threadIds: string[];
}

interface IBaseVoid {
  children: [{ text: '' }];
}

export interface SignatureElementType extends ISignatureContent, IBaseVoid, IWithThreads {
  type: UndeletableVoidElementsEnum.SIGNATURE;
}

export interface ISignature {
  name: string;
  title: string;
}

interface ISignatureContent {
  useShortName: boolean;
  saksbehandler?: ISignature;
  medunderskriver?: ISignature;
}
export interface LabelContentElementType extends IBaseVoid, IWithThreads {
  type: UndeletableVoidElementsEnum.LABEL_CONTENT;
  label: string;
  source: string;
  result?: string;
}

interface IDocumentItem {
  id: string;
  title: string;
}

export interface DocumentListElementType extends IBaseVoid, IWithThreads {
  type: UndeletableVoidElementsEnum.DOCUMENT_LIST;
  documents: IDocumentItem[];
}

export interface CurrentDateType extends IBaseVoid {
  type: UndeletableVoidElementsEnum.CURRENT_DATE;
}

export interface PageBreakElementType extends IBaseVoid {
  type: UndeletableVoidElementsEnum.PAGE_BREAK;
}

export interface HeaderElementType extends IBaseVoid, IWithThreads {
  type: UndeletableVoidElementsEnum.HEADER;
  content: string | null;
}

export interface FooterElementType extends IBaseVoid, IWithThreads {
  type: UndeletableVoidElementsEnum.FOOTER;
  content: string | null;
}

export enum Flettefelt {
  FNR = 'fnr',
  ENHET_NAME = 'enhet-name',
}

export interface FlettefeltElementType extends IBaseVoid, IMarks, IWithThreads {
  type: DeletableVoidElementsEnum.FLETTEFELT;
  content: string | null;
  field: Flettefelt | null;
}

export interface EmptyVoidElement extends IBaseVoid {
  type: UndeletableVoidElementsEnum.EMPTY_VOID;
}

type DeletableVoidTypes = FlettefeltElementType;

type VoidTypes =
  | SignatureElementType
  | LabelContentElementType
  | DocumentListElementType
  | CurrentDateType
  | PageBreakElementType
  | HeaderElementType
  | FooterElementType
  | EmptyVoidElement;

export type VoidElementTypes = VoidTypes | DeletableVoidTypes;
