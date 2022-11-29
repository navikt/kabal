import { Button, ButtonProps } from '@navikt/ds-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useHasYtelseAccess } from '../../hooks/use-has-ytelse-access';
import { OppgaveType } from '../../types/kodeverk';

interface Props extends Pick<ButtonProps, 'variant' | 'size'> {
  oppgavebehandlingId: string;
  ytelse: string;
  type: OppgaveType;
  children?: string;
}

export const OpenOppgavebehandling = ({
  oppgavebehandlingId,
  ytelse,
  type,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
}: Props) => {
  const [canOpen, isLoading] = useHasYtelseAccess(ytelse);

  if (!canOpen) {
    return null;
  }

  if (type === OppgaveType.KLAGE) {
    return (
      <Button
        as={Link}
        variant={variant}
        size={size}
        to={`/klagebehandling/${oppgavebehandlingId}`}
        loading={isLoading}
        data-testid="klagebehandling-open-link"
        data-klagebehandlingid={oppgavebehandlingId}
        data-oppgavebehandlingid={oppgavebehandlingId}
      >
        {children}
      </Button>
    );
  }

  if (type === OppgaveType.ANKE) {
    return (
      <Button
        as={Link}
        variant={variant}
        size={size}
        to={`/ankebehandling/${oppgavebehandlingId}`}
        loading={isLoading}
        data-testid="ankebehandling-open-link"
        data-ankebehandlingid={oppgavebehandlingId}
        data-oppgavebehandlingid={oppgavebehandlingId}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      as={Link}
      variant={variant}
      size={size}
      to={`/trygderettsankebehandling/${oppgavebehandlingId}`}
      loading={isLoading}
      data-testid="trygderettsankebehandling-open-link"
      data-trygderettsankebehandlingid={oppgavebehandlingId}
      data-oppgavebehandlingid={oppgavebehandlingId}
    >
      {children}
    </Button>
  );
};
