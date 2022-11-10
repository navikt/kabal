import { TextAlignEnum } from '../types/editor-enums';

export interface AlignableStyleProps {
  textAlign: TextAlignEnum;
}

export interface IndentableStyleProps {
  indent?: number;
}
