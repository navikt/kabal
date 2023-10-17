import { Button, ButtonProps } from '@navikt/ds-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { useHasRole } from '@app/hooks/use-has-role';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState, IHelper } from '@app/types/oppgave-common';
import { IOppgave } from '@app/types/oppgaver';

interface Props
  extends Pick<ButtonProps, 'variant' | 'size'>,
    Pick<IOppgave, 'id' | 'tildeltSaksbehandlerident' | 'ytelseId' | 'typeId'> {
  children?: string;
  medunderskriverident: string | null;
  rol: IHelper | null;
}

export const OpenOppgavebehandling = ({
  id,
  tildeltSaksbehandlerident,
  medunderskriverident,
  ytelseId,
  typeId,
  rol,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
}: Props) => {
  const [hasYtelseAccess, isLoading] = useHasYtelseAccess(ytelseId);
  const { data: user, isLoading: userIsLoading } = useUser();
  const isKrol = useHasRole(Role.KABAL_KROL);

  if (userIsLoading || typeof user === 'undefined') {
    return null;
  }

  const canOpen =
    hasYtelseAccess ||
    user?.navIdent === tildeltSaksbehandlerident ||
    user?.navIdent === medunderskriverident ||
    (rol !== null && user?.navIdent === rol.navIdent) ||
    (rol !== null && rol.flowState === FlowState.SENT && isKrol);

  if (!canOpen) {
    return null;
  }

  if (typeId === SaksTypeEnum.KLAGE) {
    return (
      <Button
        as={Link}
        variant={variant}
        size={size}
        to={`/klagebehandling/${id}`}
        loading={isLoading}
        data-testid="klagebehandling-open-link"
        data-klagebehandlingid={id}
        data-oppgavebehandlingid={id}
      >
        {children}
      </Button>
    );
  }

  if (typeId === SaksTypeEnum.ANKE) {
    return (
      <Button
        as={Link}
        variant={variant}
        size={size}
        to={`/ankebehandling/${id}`}
        loading={isLoading}
        data-testid="ankebehandling-open-link"
        data-ankebehandlingid={id}
        data-oppgavebehandlingid={id}
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
      to={`/trygderettsankebehandling/${id}`}
      loading={isLoading}
      data-testid="trygderettsankebehandling-open-link"
      data-trygderettsankebehandlingid={id}
      data-oppgavebehandlingid={id}
    >
      {children}
    </Button>
  );
};
