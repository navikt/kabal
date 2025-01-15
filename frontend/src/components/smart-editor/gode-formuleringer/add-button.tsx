import { useSelection } from '@app/plate/hooks/use-selection';
import type { RichTextEditor } from '@app/plate/types';
import { Button } from '@navikt/ds-react';
import type { Value } from '@udecode/plate';
import { styled } from 'styled-components';
import { insertGodFormulering } from './insert';

interface AddButtonProps {
  editor: RichTextEditor;
  content: Value;
  title?: string;
  disabledTitle?: string;
  children?: string;
}

export const AddButton = ({ editor, content, children, title = children, disabledTitle }: AddButtonProps) => {
  const selection = useSelection();
  const disabled = selection === null;

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
