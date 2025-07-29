import { useSelection } from '@app/plate/hooks/use-selection';
import type { RichTextEditor } from '@app/plate/types';
import { Button } from '@navikt/ds-react';
import type { Value } from 'platejs';
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
    <Button
      size="xsmall"
      variant="primary"
      title={disabled ? disabledTitle : title}
      onClick={() => insertGodFormulering(editor, content)}
      disabled={disabled}
      className="shrink-0"
    >
      {children}
    </Button>
  );
};
