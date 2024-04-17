import { ITextBaseMetadata, ITranslatedTextContent, PlainTextTypes, RichTextTypes } from '../common-text-types';

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  richText: ITranslatedTextContent;
}

export interface INewPlainTextParams extends ITextBaseMetadata {
  textType: PlainTextTypes;
  plainText: ITranslatedTextContent;
}

export type INewTextParams = INewRichTextParams | INewPlainTextParams;
