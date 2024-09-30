import type { KabalValue } from '@app/plate/types';
import { Language, UNTRANSLATED } from '@app/types/texts/language';
import type {
  GOD_FORMULERING_TYPE,
  ITextBaseMetadata,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
} from '../common-text-types';

export interface INewRichTextParams extends ITextBaseMetadata {
  textType: RichTextTypes;
  richText: {
    [Language.NB]: KabalValue | null;
    [Language.NN]: KabalValue | null;
  };
}

export interface INewRegelverkParams extends ITextBaseMetadata {
  textType: typeof REGELVERK_TYPE;
  richText: {
    [UNTRANSLATED]: KabalValue;
  };
}

export interface INewGodFormuleringParams extends ITextBaseMetadata {
  textType: typeof GOD_FORMULERING_TYPE;
  richText: {
    [Language.NB]: KabalValue | null;
    [Language.NN]: KabalValue | null;
  };
}

export interface INewPlainTextParams extends ITextBaseMetadata {
  textType: PlainTextTypes;
  plainText: {
    [Language.NB]: string | null;
    [Language.NN]: string | null;
  };
}

export type TextType = RichTextTypes | PlainTextTypes | typeof REGELVERK_TYPE | typeof GOD_FORMULERING_TYPE;

export type INewTextParams = INewRichTextParams | INewPlainTextParams | INewRegelverkParams | INewGodFormuleringParams;
