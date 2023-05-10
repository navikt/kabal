import { Button } from '@navikt/ds-react';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular';
import { PlateEditor, findDescendant, insertElements } from '@udecode/plate';
import React from 'react';
import { createSimpleParagraph } from '@app/components/plate-editor/templates/helpers';
import { EditorValue, MaltekstElement, RedigerbarMaltekstElement } from '@app/components/plate-editor/types';
import { nextPath } from '@app/components/plate-editor/utils/queries';

interface Props {
  element: RedigerbarMaltekstElement | MaltekstElement;
  editor: PlateEditor<EditorValue>;
}

export const AddNewParagraphButton = ({ editor, element }: Props) => (
  <Button
    title="Legg til nytt avsnitt under"
    icon={<TextAddSpaceBefore size={24} />}
    onClick={() => {
      const entry = findDescendant(editor, { at: [], match: (n) => n === element });

      if (entry === undefined) {
        return;
      }

      insertElements(editor, createSimpleParagraph(), { at: nextPath(entry[1]) });
    }}
    variant="tertiary"
    size="xsmall"
    contentEditable={false}
  />
);
