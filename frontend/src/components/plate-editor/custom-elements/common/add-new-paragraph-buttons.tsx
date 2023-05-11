import { Button } from '@navikt/ds-react';
import { TextAddSpaceAfter, TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { PlateEditor, findDescendant, insertElements } from '@udecode/plate';
import React from 'react';
import { createSimpleParagraph } from '@app/components/plate-editor/templates/helpers';
import { EditorValue, RootElement } from '@app/components/plate-editor/types';
import { nextPath } from '@app/components/plate-editor/utils/queries';

interface Props {
  element: RootElement;
  editor: PlateEditor<EditorValue>;
  className?: string;
}

export const AddNewParagraphBelow = ({ editor, element, className }: Props) => (
  <Button
    title="Legg til nytt avsnitt under"
    icon={<TextAddSpaceBefore size={24} />}
    onClick={() => {
      const entry = findDescendant<RootElement>(editor, { at: [], match: (n) => n === element });

      if (entry === undefined) {
        return;
      }

      insertElements(editor, createSimpleParagraph(), { at: nextPath(entry[1]) });
    }}
    variant="tertiary"
    size="xsmall"
    contentEditable={false}
    className={className}
  />
);

export const AddNewParagraphAbove = ({ editor, element, className }: Props) => (
  <Button
    title="Legg til nytt avsnitt over"
    icon={<TextAddSpaceAfter size={24} />}
    onClick={() => {
      const entry = findDescendant<RootElement>(editor, { at: [], match: (n) => n === element });

      if (entry === undefined) {
        return;
      }

      insertElements(editor, createSimpleParagraph(), { at: entry[1] });
    }}
    variant="tertiary"
    size="xsmall"
    contentEditable={false}
    className={className}
  />
);
