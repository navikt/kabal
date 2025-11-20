import { StaticDataContext } from '@app/components/app/static-data-context';
import { useHasRole } from '@app/hooks/use-has-role';
import { useHasYtelseAccess } from '@app/hooks/use-has-ytelse-access';
import { Role } from '@app/types/bruker';
import { FlowState, type IHelper } from '@app/types/oppgave-common';
import type { IOppgave } from '@app/types/oppgaver';
import { Button, type ButtonProps } from '@navikt/ds-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

interface BaseProps extends Omit<ButtonProps, 'id' | 'children'> {
  children?: string;
}

interface RoleAccessedProps extends BaseProps, Pick<IOppgave, 'id' | 'tildeltSaksbehandlerident' | 'ytelseId'> {
  medunderskriverident: string | null;
  rol: IHelper | null;
}

export const OpenForRoleAccess = ({
  id,
  tildeltSaksbehandlerident,
  medunderskriverident,
  rol,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
  ...buttonProps
}: RoleAccessedProps) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const { user } = useContext(StaticDataContext);
  const isKrol = useHasRole(Role.KABAL_KROL);

  const canOpen =
    isMerkantil ||
    user.navIdent === tildeltSaksbehandlerident ||
    user.navIdent === medunderskriverident ||
    (rol !== null && user.navIdent === rol.employee?.navIdent) ||
    (rol !== null && rol.flowState === FlowState.SENT && isKrol);

  if (!canOpen) {
    return null;
  }

  return (
    <Button as={Link} variant={variant} size={size} to={`/behandling/${id}`} {...buttonProps}>
      {children}
    </Button>
  );
};

interface YtelseAccessedProps extends BaseProps, Pick<IOppgave, 'id' | 'ytelseId'> {}

/** Only access to the ytelse is enough to be allowed to open the case. */
export const OpenForYtelseAccess = ({
  id,
  ytelseId,
  children = 'Åpne',
  variant = 'primary',
  size = 'small',
  ...buttonProps
}: YtelseAccessedProps) => {
  const isMerkantil = useHasRole(Role.KABAL_OPPGAVESTYRING_ALLE_ENHETER);
  const hasYtelseAccess = useHasYtelseAccess(ytelseId);

  const canOpen = isMerkantil || hasYtelseAccess;

  if (!canOpen) {
    return null;
  }

  return (
    <Button as={Link} variant={variant} size={size} to={`/behandling/${id}`} {...buttonProps}>
      {children}
    </Button>
  );
};
