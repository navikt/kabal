import { Button } from '@navikt/ds-react';
import React from 'react';
import { styled } from 'styled-components';
import { EditorValue, RichTextEditor } from '@app/plate/types';
import { insertGodFormulering, isAvailable } from './insert';

interface AddButtonProps {
  editor: RichTextEditor;
  content: EditorValue;
  title?: string;
  disabledTitle?: string;
  children?: string;
}

export const AddButton = ({ editor, content, children, title = children, disabledTitle }: AddButtonProps) => {
  const disabled = !isAvailable(editor);

  return (
    <StyledButton
      size="xsmall"
      variant="primary"
      title={disabled ? disabledTitle : title}
      onClick={() => insertGodFormulering(editor, content)}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  flex-shrink: 0;
`;
