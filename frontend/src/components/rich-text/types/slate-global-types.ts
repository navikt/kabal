/* eslint-disable import/no-unused-modules */
import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';
import { CustomRange, CustomTextType, NonVoidElementTypes } from './editor-types';
import { VoidElementTypes } from './editor-void-types';

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: NonVoidElementTypes | VoidElementTypes;
    Text: CustomTextType;
    Range: CustomRange;
  }
}
