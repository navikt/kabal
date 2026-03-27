import { Button, type ButtonProps } from '@navikt/ds-react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { StaticDataContext } from '@/components/app/static-data-context';
import { useHasAnyOfRoles, useHasRole } from '@/hooks/use-has-role';
import { useHasYtelseAccess } from '@/hooks/use-has-ytelse-access';
import { Role } from '@/types/bruker';
import { FlowState, type IHelper } from '@/types/oppgave-common';
import type { IOppgave } from '@/types/oppgaver';

interface BaseProps extends Omit<ButtonProps, 'id' | 'children'> {
  children?: string;
}

interface RoleAccessedProps extends BaseProps, Pick<IOppgave, 'id' | 'tildeltSaksbehandlerident'> {
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
    <Button as={Link} role="link" variant={variant} size={size} to={`/behandling/${id}`} {...buttonProps}>
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
  // https://nav-it.slack.com/archives/G01CTUC8LSU/p1774602742178699?thread_ts=1774601710.392819&cid=G01CTUC8LSU
  const isRolOrKrol = useHasAnyOfRoles([Role.KABAL_KROL, Role.KABAL_ROL]);
  const hasYtelseAccess = useHasYtelseAccess(ytelseId);

  const canOpen = isMerkantil || hasYtelseAccess || isRolOrKrol;

  if (!canOpen) {
    return null;
  }

  return (
    <Button as={Link} role="link" variant={variant} size={size} to={`/behandling/${id}`} {...buttonProps}>
      {children}
    </Button>
  );
};
