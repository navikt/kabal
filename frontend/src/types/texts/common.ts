import { ITextBaseMetadata, PlainTextTypes, RichTextTypes } from '../common-text-types';

export enum Language {
  NB = 'nb',
  NN = 'nn',
}

export const LANGUAGES = Object.values(Language);

export const isLanguage = (value: string): value is Language => LANGUAGES.some((lang) => lang === value);

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  // richText: {
  //   /** List of version IDs. */
  //   [Language.NB]: string[]; // EditorValue;
  //   /** List of version IDs. */
  //   [Language.NN]: string[]; // EditorValue;
  // };
}

export interface INewPlainTextParams extends ITextBaseMetadata {
  textType: PlainTextTypes;
  // plainText: {
  //   /** List of version IDs. */
  //   [Language.NB]: string[];
  //   /** List of version IDs. */
  //   [Language.NN]: string[];
  // };
}

export type INewTextParams = INewRichTextParams | INewPlainTextParams;
