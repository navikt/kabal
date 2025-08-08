import { StaticDataContext } from '@app/components/app/static-data-context';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { Role } from '@app/types/bruker';
import type { IOppgave } from '@app/types/oppgaver';
import { Button } from '@navikt/ds-react';
import { useContext } from 'react';
import { useTildel } from './use-tildel';

interface Props extends IOppgave {
  children?: string;
}

export const TildelButton = ({
  id,
  typeId,
  ytelseId,
  tildeltSaksbehandlerident,
  medunderskriver,
  rol,
  children = 'Tildel meg',
}: Props) => {
  const { user } = useContext(StaticDataContext);
  const { navIdent, navn, roller } = user;
  const [tildel, { isLoading: isTildeling }] = useTildel(id, typeId, ytelseId);
  const [, { isLoading: isFradeling }] = useTildelSaksbehandlerMutation({ fixedCacheKey: id });
  const [access, isAccessLoading] = useOppgaveActions(
    tildeltSaksbehandlerident,
    medunderskriver.employee?.navIdent ?? null,
    medunderskriver.flowState,
    rol.flowState,
    ytelseId,
  );

  if (isAccessLoading) {
    return null;
  }

  if (
    !(access.assignSelf && roller.includes(Role.KABAL_SAKSBEHANDLING)) ||
    medunderskriver.employee?.navIdent === navIdent ||
    tildeltSaksbehandlerident !== null
  ) {
    return null;
  }

  const isLoading = isTildeling || isFradeling;

  return (
    <Button
      variant="secondary-neutral"
      size="small"
      loading={isLoading}
      disabled={isLoading}
      data-testid="behandling-tildel-button"
      data-klagebehandlingid={id}
      onClick={() => tildel({ navIdent, navn })}
      className="whitespace-nowrap [grid-area:tildel]"
    >
      {children}
    </Button>
  );
};
