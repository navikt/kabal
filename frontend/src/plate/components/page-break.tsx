import { EDITOR_SCALE_CSS_VAR } from '@app/components/smart-editor/hooks/use-scale';
import { UNCHANGEABLE } from '@app/plate/plugins/element-types';
import type { PageBreakElement } from '@app/plate/types';
import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import type { PlateEditor } from '@platejs/core/react';
import { ElementApi, type NodeEntry } from 'platejs';
import { PlateElement, type PlateElementProps } from 'platejs/react';
import { styled } from 'styled-components';

const parentIsUnchangeable = (editor: PlateEditor, entry: NodeEntry<PageBreakElement> | undefined): boolean => {
  if (entry === undefined) {
    return true;
  }

  const [, path] = entry;

  const parentEntry = editor.api.parent(path);

  if (parentEntry === undefined) {
    return true;
  }

  const [parentNode, parentNodePath] = parentEntry;

  // Used to be isEditor(parentNode), but isEditor is unavailable for parentNode
  if (parentNodePath.length === 0) {
    return false;
  }

  if (!ElementApi.isElement(parentNode)) {
    return true;
  }

  return UNCHANGEABLE.includes(parentNode.type);
};

export const PageBreak = (props: PlateElementProps<PageBreakElement>) => {
  const { children, element, editor } = props;
  const entry = editor.api.node<PageBreakElement>({ at: [], match: (n) => n === element });

  const disableDelete = parentIsUnchangeable(editor, entry);

  const onClick = () => {
    if (entry === undefined) {
      return;
    }

    const [, path] = entry;

    editor.tf.removeNodes({ at: path });
  };

  return (
    <PlateElement<PageBreakElement> {...props} as="div" attributes={{ ...props.attributes, contentEditable: false }}>
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
