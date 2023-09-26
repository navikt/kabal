import { Dropdown } from '@navikt/ds-react';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { PlateEditor, findDescendant, focusEditor, insertElements } from '@udecode/plate-common';
import React from 'react';
import { createSimpleParagraph } from '@app/plate/templates/helpers';
import { EditorValue, RootElement } from '@app/plate/types';
import { nextPath } from '@app/plate/utils/queries';

interface Props {
  element: RootElement;
  editor: PlateEditor<EditorValue>;
}

export const AddNewParagraphs = ({ editor, element }: Props) => (
  <>
    <AddNewParagraphAbove editor={editor} element={element} />
    <AddNewParagraphBelow editor={editor} element={element} />
  </>
);

export const AddNewParagraphBelow = ({ editor, element }: Props) => (
  <Dropdown.Menu.GroupedList.Item
    onClick={() => {
      const entry = findDescendant(editor, { at: [], match: (n) => n === element });

      if (entry === undefined) {
        return;
      }

      focusEditor(editor);
      insertElements(editor, createSimpleParagraph(), { at: nextPath(entry[1]), select: true });
    }}
  >
    <TextAddSpaceAfter size="20px" aria-hidden /> Legg til nytt avsnitt under
  </Dropdown.Menu.GroupedList.Item>
);

export const AddNewParagraphAbove = ({ editor, element }: Props) => (
  <Dropdown.Menu.GroupedList.Item
    onClick={() => {
      const entry = findDescendant<RootElement>(editor, { at: [], match: (n) => n === element });

      if (entry === undefined) {
        return;
      }

      focusEditor(editor);
      insertElements(editor, createSimpleParagraph(), { at: entry[1], select: true });
    }}
  >
    <TextAddSpaceBefore size="20px" aria-hidden /> Legg til nytt avsnitt over
  </Dropdown.Menu.GroupedList.Item>
);
