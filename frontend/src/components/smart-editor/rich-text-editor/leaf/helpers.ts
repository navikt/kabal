import { IMarks } from '../../editor-types';

export interface LeafStyleProps extends IMarks {
  selected?: boolean;
  focused?: boolean;
  commentIds: string[];
  children: React.ReactNode;
}

export const getTextDecoration = ({ underline, strikethrough }: LeafStyleProps) => {
  if (underline === true && strikethrough === true) {
    return 'underline strikethrough';
  }

  if (underline === true) {
    return 'underline';
  }

  if (strikethrough === true) {
    return 'line-through';
  }

  return 'none';
};

export const getScriptDecoration = ({ subscript, superscript }: LeafStyleProps) => {
  if (superscript === true) {
    return 'super';
  }

  if (subscript === true) {
    return 'sub';
  }

  return 'unset';
};

export const getFontSize = ({ subscript, superscript }: LeafStyleProps) =>
  subscript === true || superscript === true ? 'smaller' : 'unset';

export const getColor = (comments: number, selected: boolean, focused: boolean) => {
  if (selected === true) {
    return `lightblue`;
  }

  if (comments === 0) {
    return 'none';
  }

  const lightness = 100 - 15 * Math.min(comments, 3);
  const hue = focused ? 0 : 125;
  const saturation = focused ? 75 : 50;
  return `hsla(${hue}, ${saturation}%, ${lightness}%, 1)`;
};
