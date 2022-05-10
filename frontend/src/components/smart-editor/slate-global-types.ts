import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import {
  BlockquoteElementType,
  CustomRange,
  CustomTextType,
  HeadingsType,
  ListsType,
  ParagraphElementType,
} from './editor-types';
import { VoidTypes } from './editor-void-types';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: ParagraphElementType | BlockquoteElementType | HeadingsType | ListsType | VoidTypes;
    Text: CustomTextType;
    Range: CustomRange;
  }
}
