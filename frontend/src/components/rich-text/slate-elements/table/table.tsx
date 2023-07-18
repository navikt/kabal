import { Button, Tooltip } from '@navikt/ds-react';
import { TextAddSpaceAfter } from '@styled-icons/fluentui-system-regular/TextAddSpaceAfter';
import { TextAddSpaceBefore } from '@styled-icons/fluentui-system-regular/TextAddSpaceBefore';
import React, { useMemo } from 'react';
import { Editor, Path, Transforms } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';
import { styled } from 'styled-components';
import { createSimpleParagraph } from '../../../smart-editor/templates/helpers';
import { UndeletableContentEnum } from '../../types/editor-enums';
import { isOfElementType } from '../../types/editor-type-guards';
import { TableElementType } from '../../types/editor-types';
import { RenderElementProps } from '../render-props';
import { BORDER_WIDTH } from './td';

export const TableElement = ({ attributes, children, element }: RenderElementProps<TableElementType>) => (
  <Container>
    <TableTooltip element={element}>
      <StyledTable {...attributes}>{children}</StyledTable>
    </TableTooltip>
  </Container>
);

interface TableTooltipProps {
  children: React.ReactElement;
  element: TableElementType;
}

const TableTooltip = ({ children, element }: TableTooltipProps) => {
  const editor = useSlateStatic();
  const nonEditable = useMemo<boolean>(() => {
    const path = ReactEditor.findPath(editor, element);
    const [parentNode] = Editor.parent(editor, path);

    return isOfElementType(parentNode, UndeletableContentEnum.MALTEKST);
  }, [editor, element]);

  if (nonEditable) {
    return <>{children}</>;
  }

  const addParagraphBelow = () => {
    const path = ReactEditor.findPath(editor, element);
    const at = Path.next(path);
    Transforms.insertNodes(editor, createSimpleParagraph(), { at });
    Transforms.select(editor, at);
    ReactEditor.focus(editor);
  };

  const addParagraphAbove = () => {
    const at = ReactEditor.findPath(editor, element);
    Transforms.insertNodes(editor, createSimpleParagraph(), { at });
    Transforms.select(editor, at);
    ReactEditor.focus(editor);
  };

  return (
    <>
      <Tooltip content="Høyreklikk for å endre tabellen" placement="top">
        {children}
      </Tooltip>
      <StyledAboveButton
        contentEditable={false}
        onClick={addParagraphAbove}
        title="Legg til nytt avsnitt over"
        icon={<TextAddSpaceAfter size={24} />}
        variant="tertiary"
        size="xsmall"
      />
      <StyledBelowButton
        contentEditable={false}
        onClick={addParagraphBelow}
        title="Legg til nytt avsnitt under"
        icon={<TextAddSpaceBefore size={24} />}
        variant="tertiary"
        size="xsmall"
      />
    </>
  );
};

const StyledTable = styled.table`
  border-collapse: collapse;
  max-width: 100%;
  margin: 0;
`;

const StyledAboveButton = styled(Button)`
  position: absolute;
  right: 100%;
  top: -${BORDER_WIDTH}px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:focus {
    opacity: 1;
  }
`;

const StyledBelowButton = styled(Button)`
  position: absolute;
  left: 100%;
  bottom: -${BORDER_WIDTH}px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &:focus {
    opacity: 1;
  }
`;

const Container = styled.div`
  position: relative;
  max-width: 100%;

  &:hover {
    ${StyledBelowButton}, ${StyledAboveButton} {
      opacity: 1;
    }
  }
`;
