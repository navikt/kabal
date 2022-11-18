import React, { useCallback, useContext, useMemo } from 'react';
import { Editor, Element, Range } from 'slate';
import { FeatureToggles, useFeatureToggle } from '../../../../hooks/use-feature-toggle';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { arrowDown, arrowLeft, arrowRight, arrowUp } from './arrows/arrows';
import { backspace } from './backspace';
import { deleteHandler } from './delete';
import { enter } from './enter';
import { hotkeys } from './hotkeys';
import { maltekst } from './maltekst';
import { placeholder } from './placeholder';
import { space } from './space';
import { tab } from './tab';
import { FeatureFlags, HandlerFn, HandlerFnArg, Key, SafeEditor } from './types';

const HANDLERS: Map<Key, HandlerFn> = new Map([
  [Key.ENTER, enter],
  [Key.BACKSPACE, backspace],
  [Key.DELETE, deleteHandler],
  [Key.TAB, tab],
  [Key.SPACE, space],
  [Key.ARROW_RIGHT, arrowRight],
  [Key.ARROW_LEFT, arrowLeft],
  [Key.ARROW_UP, arrowUp],
  [Key.ARROW_DOWN, arrowDown],
]);

const HOTKEY_HANDLERS: HandlerFn[] = [placeholder, maltekst, hotkeys];

const keys = Object.values(Key);

const isSafeEditor = (editor: Editor): editor is SafeEditor => {
  if (editor.selection === null) {
    return false;
  }

  return true;
};

export const useKeyboard = (editor: Editor) => {
  const context = useContext(SmartEditorContext);

  const malteksterEnabled = useFeatureToggle(FeatureToggles.MALTEKSTER);

  const featureFlags: FeatureFlags = useMemo(
    () => ({
      [FeatureToggles.MALTEKSTER]: malteksterEnabled,
    }),
    [malteksterEnabled]
  );

  return useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!isSafeEditor(editor)) {
        return;
      }

      const [currentElement] = Editor.nodes(editor, {
        match: Element.isElement,
        mode: 'lowest',
      });

      if (typeof currentElement === 'undefined') {
        return;
      }

      const args: HandlerFnArg = {
        editor,
        context,
        event,
        featureFlags,
        isCollapsed: Range.isCollapsed(editor.selection),
        currentElementEntry: currentElement,
      };

      HOTKEY_HANDLERS.forEach((handler) => {
        if (!event.defaultPrevented) {
          handler(args);
        }
      });

      if (event.isDefaultPrevented()) {
        return;
      }

      const { key } = event;

      if (isKey<Key>(key)) {
        HANDLERS.get(key)?.(args);
      }
    },
    [context, editor, featureFlags]
  );
};

const isKey = <T extends Key>(key: string): key is T => keys.some((k) => k === key);
