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
import { type Descendant, type InsertTextOptions, RangeApi } from '@udecode/plate';
import { createPlatePlugin } from '@udecode/plate-core/react';

export const createCapitalisePlugin = (ident: string) => {
  const settingsKey = `${ident}/${CAPITALISE_SETTING_KEY}`;

  return createPlatePlugin({ key: 'capitalise' }).overrideEditor(({ editor }) => {
    const { insertText, insertFragment, deleteBackward } = editor.tf;

    // If next to capitalised node, create new node that is uncapitalised
    const insertUncapitalised = (text: string, options: InsertTextOptions | undefined) =>
      editor.api.some({ match: { autoCapitalised: true } })
        ? editor.tf.withoutMerging(() => editor.tf.insertNode({ text }))
        : insertText(text, options);

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
      if (editor.selection === null || RangeApi.isExpanded(editor.selection)) {
        return deleteBackward(unit);
      }

      const capitalised = editor.api.node({ at: editor.selection.anchor, match: { autoCapitalised: true } });

      if (capitalised === undefined) {
        return deleteBackward(unit);
      }

      const char = editor.api.string({
        anchor: editor.selection.anchor,
        focus: { ...editor.selection.anchor, offset: editor.selection.anchor.offset - 1 },
      });

      editor.tf.withNewBatch(() => {
        deleteBackward('character');
        insertText(char.toLowerCase());
        editor.tf.setNodes({ autoCapitalised: false });
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
