import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { Transforms } from 'slate';
import { useSlateStatic } from 'slate-react';
import styled from 'styled-components';
import { RenderElementProps } from '../slate-elements/render-props';

export const PageBreak = ({ element, children, attributes }: RenderElementProps) => {
  const editor = useSlateStatic();

  const onClick = useCallback(
    () => Transforms.removeNodes(editor, { match: (n) => n === element, at: [] }),
    [editor, element]
  );

  return (
    <StyledPageBreak {...attributes} contentEditable={false}>
      <StyledDeleteButton
        onClick={onClick}
        title="Fjern sideskift"
        variant="danger"
        size="small"
        icon={<TrashIcon aria-hidden />}
      >
        Fjern sideskift
      </StyledDeleteButton>
      {children}
    </StyledPageBreak>
  );
};

const StyledDeleteButton = styled(Button)`
  flex-grow: 0;
  width: fit-content;
  align-self: center;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  :focus {
    opacity: 1;
  }
`;

const StyledPageBreak = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: -20mm;
  margin-right: -20mm;
  background-color: rgba(0, 0, 0, 0.05);
  position: relative;

  ::after,
  ::before {
    content: '';
    width: 100%;
    height: 24px;
    background-color: #fff;
  }

  ::before {
    box-shadow: 0px 5px 5px 0px rgba(0, 0, 0, 0.25);
  }
  ::after {
    box-shadow: 0px -5px 5px 0px rgba(0, 0, 0, 0.25);
  }

  :hover {
    > ${StyledDeleteButton} {
      opacity: 1;
    }
  }
`;
