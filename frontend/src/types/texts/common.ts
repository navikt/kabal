import type { KabalValue } from '@/plate/types';
import type { GOD_FORMULERING_TYPE, ITextBaseMetadata, REGELVERK_TYPE, RichTextTypes } from '@/types/common-text-types';
import { Language, UNTRANSLATED } from '@/types/texts/language';

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

export type TextType = RichTextTypes | typeof REGELVERK_TYPE | typeof GOD_FORMULERING_TYPE;

export type INewTextParams = INewRichTextParams | INewRegelverkParams | INewGodFormuleringParams;

interface BaseListText {
  id: string;
  title: string;
  modified: string;
  publishedDateTime: string | null;
  published: boolean;
}

export interface ListRichText extends BaseListText {
  textType: RichTextTypes;
  richText: { [Language.NB]: KabalValue | null; [Language.NN]: KabalValue | null };
  draftMaltekstseksjonIdList: string[];
  publishedMaltekstseksjonIdList: string[];
}

export interface ListRegelverk extends BaseListText {
  textType: typeof REGELVERK_TYPE;
  richText: { [UNTRANSLATED]: KabalValue };
}

export interface ListGodFormulering extends BaseListText {
  textType: typeof GOD_FORMULERING_TYPE;
  richText: { [Language.NB]: KabalValue | null; [Language.NN]: KabalValue | null };
}
