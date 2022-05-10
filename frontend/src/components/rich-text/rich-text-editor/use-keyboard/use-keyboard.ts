import React, { useCallback, useContext, useMemo } from 'react';
import { Editor } from 'slate';
import { FeatureToggles, useFeatureToggle } from '../../../../hooks/use-feature-toggle';
import { SmartEditorContext } from '../../../smart-editor/context/smart-editor-context';
import { arrows } from './arrows';
import { backspace } from './backspace';
import { enter } from './enter';
import { hotkeys } from './hotkeys';
import { space } from './space';
import { tab } from './tab';
import { FeatureFlags, HandlerFn, SafeEditor } from './types';

const handlers: HandlerFn[] = [enter, hotkeys, backspace, tab, space, arrows];

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

      const arg = { editor, context, event, featureFlags };
      handlers.forEach((f) => {
        if (!event.isDefaultPrevented()) {
          f(arg);
        }
      });
    },
    [context, editor, featureFlags]
  );
};
