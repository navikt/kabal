import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import { Button, Tooltip } from '@navikt/ds-react';
import { PlateEditor } from '@udecode/plate-common';
import { Path } from 'slate';
import { AddNewParagraphs } from '@app/plate/components/common/add-new-paragraph-buttons';
import { DeleteMaltekstseksjon } from '@app/plate/components/maltekstseksjon/delete-maltekstseksjon';
import { MaltekstseksjonToolbar } from '@app/plate/components/styled-components';
import { EditorValue, MaltekstseksjonElement } from '@app/plate/types';

interface Props {
  editor: PlateEditor<EditorValue>;
  element: MaltekstseksjonElement;
  path: Path | undefined;
  isInRegelverk: boolean;
  isFetching: boolean;
  update: () => void;
}

export const Toolbar = ({ editor, element, path, isInRegelverk, isFetching, update }: Props) => (
  <MaltekstseksjonToolbar contentEditable={false}>
    <AddNewParagraphs editor={editor} element={element} />
    <Tooltip content="Oppdater til siste versjon" delay={0}>
      <Button
        icon={<ArrowCirclepathIcon aria-hidden />}
        onClick={update}
        variant="tertiary"
        size="xsmall"
        contentEditable={false}
        loading={isFetching}
      />
    </Tooltip>
    {isInRegelverk ? null : <DeleteMaltekstseksjon element={element} path={path} />}
  </MaltekstseksjonToolbar>
);
