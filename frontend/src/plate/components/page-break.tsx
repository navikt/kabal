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
import { styled } from 'styled-components';
import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
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
    <PlateElement asChild attributes={attributes} element={element} editor={editor} contentEditable={false}>
      <StyledPageBreak>
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
      </StyledPageBreak>
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

const StyledPageBreak = styled.div`
  background-color: var(--a-surface-subtle);
  position: relative;
  height: calc(var(${EDITOR_SCALE_CSS_VAR}) * 8mm);
  margin-top: calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm);
  margin-bottom: calc(var(${EDITOR_SCALE_CSS_VAR}) * 20mm);
  margin-left: calc((var(${EDITOR_SCALE_CSS_VAR}) * -20mm) - var(--a-spacing-4));
  margin-right: calc((var(${EDITOR_SCALE_CSS_VAR}) * -20mm) - var(--a-spacing-4));

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: var(--a-spacing-4);
    right: var(--a-spacing-4);
    height: 10px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: var(--a-spacing-4);
    right: var(--a-spacing-4);
    height: 10px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0));
  }

  &:hover {
    > ${StyledDeleteButton} {
      opacity: 1;
    }
  }
`;
