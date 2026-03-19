import { Button } from '@navikt/ds-react';
import type { Value } from 'platejs';
import { insertGodFormulering } from '@/components/smart-editor/gode-formuleringer/insert';
import { useSelection } from '@/plate/hooks/use-selection';
import type { RichTextEditor } from '@/plate/types';

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
