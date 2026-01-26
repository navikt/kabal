import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  onDelete: () => void;
}

export const DeleteButton = ({ onDelete }: Props) => {
  const oppgaveId = useOppgaveId();
  const [showConfirm, setShowConfirm] = useState(false);

  if (typeof oppgaveId !== 'string') {
    return null;
  }

  const toggleConfirm = () => setShowConfirm(!showConfirm);

  if (showConfirm) {
    return (
      <>
        <Button
          data-color="danger"
          variant="primary"
          icon={<TrashIcon aria-hidden />}
          onClick={onDelete}
          size="small"
        />
        <Button
          data-color="neutral"
          variant="secondary"
          icon={<ArrowUndoIcon aria-hidden />}
          onClick={() => setShowConfirm(false)}
          size="small"
        />
      </>
    );
  }

  return (
    <Button
      data-color="danger"
      variant="primary"
      icon={<TrashIcon aria-hidden />}
      onClick={toggleConfirm}
      size="small"
    />
  );
};
