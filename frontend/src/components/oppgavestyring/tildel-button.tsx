import { Button } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useUser } from '@app/simple-api-state/use-user';
import { Role } from '@app/types/bruker';
import { IOppgave } from '@app/types/oppgaver';
import { useFradel, useTildel } from './use-tildel';

interface Props extends IOppgave {
  children?: string;
}

export const TildelButton = ({
  id,
  type,
  ytelse,
  tildeltSaksbehandlerident,
  medunderskriverident,
  erMedunderskriver,
  children = 'Tildel meg',
}: Props) => {
  const { data: user, isLoading: isUserLoading } = useUser();
  const [tildel, { isLoading: isTildeling }] = useTildel(id, type, ytelse);
  const [, { isLoading: isFradeling }] = useFradel(id, type, ytelse);
  const [access, isAccessLoading] = useOppgaveActions(tildeltSaksbehandlerident, medunderskriverident !== null, ytelse);

  if (isUserLoading || isAccessLoading || typeof user === 'undefined') {
    return null;
  }

  if (
    !access.assignSelf ||
    !user.roller.includes(Role.KABAL_SAKSBEHANDLING) ||
    erMedunderskriver ||
    tildeltSaksbehandlerident === user.navIdent
  ) {
    return null;
  }

  const disabled = isUserLoading;
  const isLoading = isUserLoading || isTildeling || isFradeling;

  return (
    <StyledButton
      variant="secondary"
      size="small"
      loading={isLoading}
      disabled={disabled || isLoading}
      data-testid="behandling-tildel-button"
      data-klagebehandlingid={id}
      onClick={() => {
        if (typeof user === 'undefined') {
          return;
        }

        tildel(user.navIdent);
      }}
    >
      {children}
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  grid-area: tildel;
  white-space: nowrap;
  /* max-width: fit-content; */
  width: 100px;
`;
