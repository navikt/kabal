import { Select } from '@navikt/ds-react';
import { NONE } from '@app/components/behandling/behandlingsdialog/rol/constants';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/rol/helpers';
import { SELECT_SKELETON } from '@app/components/behandling/behandlingsdialog/rol/skeleton';
import { useHasRole } from '@app/hooks/use-has-role';
import { useIsRol } from '@app/hooks/use-is-rol';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { useGetPotentialRolQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { Role } from '@app/types/bruker';
import { FlowState, IMedunderskriverRol } from '@app/types/oppgave-common';

interface Props {
  oppgaveId: string;
  rol: IMedunderskriverRol;
  isSaksbehandler: boolean;
}

export const SelectRol = ({ oppgaveId, rol, isSaksbehandler }: Props) => {
  const { data: potentialRol, isLoading: potentialRolIsLoading } = useGetPotentialRolQuery(oppgaveId);
  const [setRol, { isLoading: setRolIsLoading }] = useSetRolMutation({ fixedCacheKey: getFixedCacheKey(oppgaveId) });
  const isRol = useIsRol();
  const isKrol = useHasRole(Role.KABAL_KROL);

  const onChange = (newValue: string) => {
    const employee = newValue === NONE ? null : (potentialRol?.rols.find((r) => r.navIdent === newValue) ?? null);
    setRol({ oppgaveId, employee });
  };

  const canSelect = isSaksbehandler || isRol || isKrol;

  if (!canSelect) {
    return null;
  }

  if (potentialRolIsLoading || potentialRol === undefined) {
    return SELECT_SKELETON;
  }

  const options = potentialRol.rols.map(({ navIdent, navn }) => (
    <option key={navIdent} value={navIdent} label={navn} />
  ));

  return (
    <Select
      disabled={setRolIsLoading}
      label="Rådgivende overlege"
      onChange={({ target }) => onChange(target.value)}
      size="small"
      value={rol.employee?.navIdent ?? NONE}
    >
      <option value={NONE}>{rol.flowState === FlowState.SENT ? 'Felles kø' : 'Ingen / felles kø'}</option>
      {options}
    </Select>
  );
};
