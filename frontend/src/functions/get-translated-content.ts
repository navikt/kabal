import { EditorValue } from '@app/plate/types';
import { INewPlainTextParams, INewRichTextParams, Language } from '@app/types/texts/common';

export const getRichText = (language: Language, versions: INewRichTextParams['richText']): EditorValue =>
  versions[language];

export const getPlainText = (language: Language, versions: INewPlainTextParams['plainText']): string =>
  versions[language];
