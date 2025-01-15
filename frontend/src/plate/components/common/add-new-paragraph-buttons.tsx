import { createSimpleParagraph } from '@app/plate/templates/helpers';
import type { RootElement } from '@app/plate/types';
import { nextPath } from '@app/plate/utils/queries';
import { Button, Tooltip } from '@navikt/ds-react';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { type PlateEditor, useEditorReadOnly } from '@udecode/plate/react';

interface Props {
  element: RootElement;
  editor: PlateEditor;
}

export const AddNewParagraphs = ({ editor, element }: Props) => {
  if (useEditorReadOnly()) {
    return null;
  }

  return (
    <>
      <AddNewParagraphAbove editor={editor} element={element} />
      <AddNewParagraphBelow editor={editor} element={element} />
    </>
  );
};

export const AddNewParagraphBelow = ({ editor, element }: Props) => (
  <Tooltip content="Legg til nytt avsnitt under" delay={0}>
    <Button
      icon={<TextAddSpaceAfter size={20} aria-hidden />}
      onClick={() => {
        const entry = editor.api.descendant({ at: [], match: (n) => n === element });

        if (entry === undefined) {
          return;
        }

        editor.tf.insertNodes(createSimpleParagraph(), { at: nextPath(entry[1]) });
      }}
      variant="tertiary"
      size="xsmall"
      contentEditable={false}
    />
  </Tooltip>
);

export const AddNewParagraphAbove = ({ editor, element }: Props) => (
  <Tooltip content="Legg til nytt avsnitt over" delay={0}>
    <Button
      icon={<TextAddSpaceBefore size={20} aria-hidden />}
      onClick={() => {
        const entry = editor.api.descendant<RootElement>({ at: [], match: (n) => n === element });

        if (entry === undefined) {
          return;
        }

        editor.tf.insertNodes(createSimpleParagraph(), { at: entry[1] });
      }}
      variant="tertiary"
      size="xsmall"
      contentEditable={false}
    />
  </Tooltip>
);
