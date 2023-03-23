import { Button, ButtonProps } from '@navikt/ds-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { useUser } from '@app/simple-api-state/use-user';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { IOppgave } from '@app/types/oppgaver';

interface Props extends Pick<ButtonProps, 'variant' | 'size'> {
  oppgavebehandlingId: IOppgave['id'];
  tildeltSaksbehandlerident: IOppgave['tildeltSaksbehandlerident'];
  medunderskriverident: IOppgave['medunderskriverident'];
  ytelse: IOppgave['ytelse'];
  type: IOppgave['type'];
  children?: string;
}

export const OpenOppgavebehandling = ({
  oppgavebehandlingId,
  tildeltSaksbehandlerident,
  medunderskriverident,
  ytelse,
  type,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
}: Props) => {
  const [hasYtelseAccess, isLoading] = useHasYtelseAccess(ytelse);
  const { data: user, isLoading: userIsLoading } = useUser();

  if (userIsLoading || typeof user === 'undefined') {
    return null;
  }

  const canOpen =
    hasYtelseAccess || user?.navIdent === tildeltSaksbehandlerident || user?.navIdent === medunderskriverident;

  if (!canOpen) {
    return null;
  }

  if (type === SaksTypeEnum.KLAGE) {
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

  if (type === SaksTypeEnum.ANKE) {
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
