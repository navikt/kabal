import { IText, TemplateSections, TextMetadata } from '../../../types/texts/texts';
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

export interface ISignatureContent {
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

export interface MaltekstElementType extends IBaseVoid, IWithThreads, Partial<TextMetadata> {
  type: UndeletableVoidElementsEnum.MALTEKST;
  section: TemplateSections;
  content: IText[] | null;
}

export interface IDocumentItem {
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

export type DeletableVoidTypes = FlettefeltElementType;

export type VoidTypes =
  | SignatureElementType
  | MaltekstElementType
  | LabelContentElementType
  | DocumentListElementType
  | CurrentDateType
  | PageBreakElementType;

export type CommentableVoidElementTypes =
  | SignatureElementType
  | LabelContentElementType
  | MaltekstElementType
  | DocumentListElementType
  | HeaderElementType
  | FooterElementType;

export type VoidElementTypes = CommentableVoidElementTypes | VoidTypes | DeletableVoidTypes;

export type MaltekstElementTypes = MaltekstElementType | HeaderElementType | FooterElementType;
