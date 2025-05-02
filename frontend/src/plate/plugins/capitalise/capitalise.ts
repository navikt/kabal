import { SETTINGS_MANAGER } from '@app/hooks/settings/manager';
import { CAPITALISE_SETTING_KEY } from '@app/hooks/settings/use-setting';
import {
  capitaliseFirstNodeWithText,
  hasMultipleBlocks,
  isOrdinalOrAbbreviation,
  isSingleWord,
  nodeContainsSingleWord,
  skipCapitalisation,
} from '@app/plate/plugins/capitalise/helpers';
import type { FormattedText } from '@app/plate/types';
import { isText } from '@app/plate/utils/queries';
import { type Descendant, type EditorSelection, type InsertTextOptions, RangeApi } from '@udecode/plate';
import { createPlatePlugin } from '@udecode/plate-core/react';

export const createCapitalisePlugin = (ident: string) => {
  const settingsKey = `${ident}/${CAPITALISE_SETTING_KEY}`;

  return createPlatePlugin({ key: 'capitalise' }).overrideEditor(({ editor }) => {
    const { insertText, insertFragment, deleteBackward } = editor.tf;

    // If next to capitalised node, create new node that is uncapitalised
    const insertUncapitalised = (text: string, options: InsertTextOptions | undefined) => {
      if (options?.marks === false) {
        // If marks are explicitly ignored, the default behaviour is to insert the text without any marks.
        // No need to manually remove the autoCapitalised mark.
        // Default value for `options.marks` is `true`.
        return insertText(text, options);
      }

      // Get the marks that would be applied to the text.
      const marks = editor.api.marks();

      if (marks === null || marks.autoCapitalised !== true) {
        // If there is no autoCapitalised mark, or if the autoCapitalised mark is not true, there is no need to manually remove it.
        return insertText(text, options);
      }

      // Strip the autoCapitalised mark from the marks object.
      const { autoCapitalised, ...marksWithoutAutoCapitalised } = marks;

      // Insert the text with the remaining marks.
      return editor.tf.insertNode<FormattedText>({ ...marksWithoutAutoCapitalised, text });
    };

    editor.tf.insertText = (text, options) => {
      const enabled = SETTINGS_MANAGER.get(settingsKey);

      if (enabled !== 'true') {
        return insertUncapitalised(text, options);
      }

      if (editor.selection === null || !isSingleWord(text)) {
        return insertUncapitalised(text, options);
      }

      if (skipCapitalisation(editor)) {
        return insertUncapitalised(text, options);
      }

      if (isOrdinalOrAbbreviation(editor)) {
        return insertUncapitalised(text, options);
      }

      const marks = editor.api.marks();

      editor.tf.withNewBatch(() => {
        editor.tf.insertNode({ text: text.charAt(0).toUpperCase(), ...marks, autoCapitalised: true });

        if (text.length > 1) {
          editor.tf.insertNode({ text: text.slice(1), ...marks });
        }
      });
    };

    editor.tf.deleteBackward = (unit) => {
      if (editor.selection === null || unit !== 'character' || RangeApi.isExpanded(editor.selection)) {
        return deleteBackward(unit);
      }

      const anchor = editor.api.before(editor.selection.anchor, { distance: 1, unit });

      if (anchor === undefined) {
        return deleteBackward(unit);
      }

      const rangeToDelete: EditorSelection = { anchor, focus: editor.selection.anchor };

      const capitalisedEntry = editor.api.node({ at: rangeToDelete, match: { autoCapitalised: true } });

      if (capitalisedEntry === undefined) {
        return deleteBackward(unit);
      }

      const [capitalisedNode] = capitalisedEntry;

      if (!isText(capitalisedNode)) {
        return deleteBackward(unit);
      }

      const { text, autoCapitalised, ...marks } = capitalisedNode;

      editor.tf.withNewBatch(() => {
        deleteBackward(unit);
        editor.tf.insertNode({ text: text.toLowerCase(), ...marks });
      });
    };

    editor.tf.insertFragment = (fragment: Descendant[], options) => {
      if (skipCapitalisation(editor)) {
        return insertFragment(fragment, options);
      }

      if (hasMultipleBlocks(editor, fragment) || !fragment.every((c) => nodeContainsSingleWord(editor, c))) {
        return insertFragment(fragment, options);
      }

      capitaliseFirstNodeWithText(fragment);

      return insertFragment(fragment, options);
    };

    return editor;
  });
};
