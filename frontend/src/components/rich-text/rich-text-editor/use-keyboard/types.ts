import { Editor, Element, NodeEntry, Range } from 'slate';
import { FeatureToggles } from '../../../../hooks/use-feature-toggle';
import { ISmartEditorContext } from '../../../smart-editor/context/smart-editor-context';

export interface SafeEditor extends Editor {
  selection: Range;
}

export type FeatureFlags = Record<FeatureToggles, boolean>;

export enum Key {
  BACKSPACE = 'Backspace',
  DELETE = 'Delete',
  ENTER = 'Enter',
  SPACE = ' ',
  TAB = 'Tab',
  ESCAPE = 'Escape',
  ARROW_RIGHT = 'ArrowRight',
  ARROW_LEFT = 'ArrowLeft',
  ARROW_UP = 'ArrowUp',
  ARROW_DOWN = 'ArrowDown',
  HOME = 'Home',
  END = 'End',
}

export interface HandlerFnArg {
  editor: SafeEditor;
  event: React.KeyboardEvent<HTMLDivElement>;
  context: ISmartEditorContext;
  featureFlags: FeatureFlags;
  isCollapsed: boolean;
  currentElementEntry: NodeEntry<Element>;
}

export type HandlerFn = (arg: HandlerFnArg) => void;
