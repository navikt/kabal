import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import {
  PlateElement,
  PlateRenderElementProps,
  TNodeEntry,
  findNode,
  getParentNode,
  isEditor,
  isElement,
  removeNodes,
} from '@udecode/plate-common';
import React from 'react';
import { styled } from 'styled-components';
import { UNCHANGEABLE } from '@app/plate/plugins/element-types';
import { EditorValue, PageBreakElement, RichTextEditor } from '@app/plate/types';

const parentIsUnchangeable = (editor: RichTextEditor, entry: TNodeEntry<PageBreakElement> | undefined): boolean => {
  if (entry === undefined) {
    return true;
  }

  const [, path] = entry;

  const parentEntry = getParentNode(editor, path);

  if (parentEntry === undefined) {
    return true;
  }

  const [parentNode] = parentEntry;

  if (isEditor(parentNode)) {
    return false;
  }

  if (!isElement(parentNode)) {
    return true;
  }

  return UNCHANGEABLE.includes(parentNode.type);
};

export const PageBreak = ({
  element,
  children,
  attributes,
  editor,
}: PlateRenderElementProps<EditorValue, PageBreakElement>) => {
  const entry = findNode<PageBreakElement>(editor, { at: [], match: (n) => n === element });

  const disableDelete = parentIsUnchangeable(editor, entry);

  const onClick = () => {
    if (entry === undefined) {
      return;
    }

    const [, path] = entry;

    removeNodes(editor, { at: path });
  };

  return (
    <PlateElement
      as={StyledPageBreak}
      attributes={attributes}
      element={element}
      editor={editor}
      contentEditable={false}
    >
      {disableDelete ? null : (
        <StyledDeleteButton
          onClick={onClick}
          title="Fjern sideskift"
          variant="tertiary-neutral"
          size="xsmall"
          icon={<TrashIcon aria-hidden />}
        >
          Fjern sideskift
        </StyledDeleteButton>
      )}
      {children}
    </PlateElement>
  );
};

const StyledDeleteButton = styled(Button)`
  position: absolute;
  flex-grow: 0;
  width: fit-content;
  align-self: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 1;

  &:focus {
    opacity: 1;
  }
`;

export const StyledPageBreak = styled.div`
  background-color: var(--a-bg-subtle);
  position: relative;
  height: 20mm;
  margin-top: 20mm;
  margin-bottom: 20mm;
  margin-left: calc(-20mm - 16px);
  margin-right: calc(-20mm - 16px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 16px;
    right: 16px;
    height: 10px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 16px;
    right: 16px;
    height: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
  }

  &:hover {
    > ${StyledDeleteButton} {
      opacity: 1;
    }
  }
`;
