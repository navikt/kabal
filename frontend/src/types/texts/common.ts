import { EditorValue } from '@app/plate/types';
import { ITextBaseMetadata, PlainTextTypes, RichTextTypes } from '../common-text-types';

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  content: EditorValue;
}

export interface INewPlainTextParams extends ITextBaseMetadata {
  textType: PlainTextTypes;
  plainText: string;
}

export type INewTextParams = INewRichTextParams | INewPlainTextParams;
