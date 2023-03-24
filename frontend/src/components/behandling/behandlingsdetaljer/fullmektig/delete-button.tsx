import { ArrowUndoIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useUpdateFullmektigMutation } from '@app/redux-api/oppgaver/mutations/behandling';

interface Props {
  close: () => void;
  show: boolean;
}

export const DeleteButton = ({ show, close }: Props) => {
  const [setFullmektig, { isLoading }] = useUpdateFullmektigMutation();
  const oppgaveId = useOppgaveId();
  const [showConfirm, setShowConfirm] = useState(false);

  if (!show || typeof oppgaveId !== 'string') {
    return null;
  }

  const onClick = () => setFullmektig({ fullmektig: { person: null, virksomhet: null }, oppgaveId }).then(close);

  const toggleConfirm = () => setShowConfirm(!showConfirm);

  if (showConfirm) {
    return (
      <>
        <Button variant="danger" icon={<TrashIcon aria-hidden />} onClick={onClick} size="small" loading={isLoading} />
        <Button
          variant="secondary"
          icon={<ArrowUndoIcon aria-hidden />}
          onClick={() => setShowConfirm(false)}
          size="small"
        />
      </>
    );
  }

  return <Button variant="danger" icon={<TrashIcon aria-hidden />} onClick={toggleConfirm} size="small" />;
};
