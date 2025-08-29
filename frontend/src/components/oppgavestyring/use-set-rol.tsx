import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { successToast } from '@app/components/oppgavestyring/toasts';
import type { OnChange } from '@app/components/oppgavestyring/types';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import type { INavEmployee } from '@app/types/bruker';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';
import { EMPTY_MEDUNDERSKRIVERE, type Return } from './use-set-medunderskriver';

export const useSetRol = (oppgaveId: string, rol: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE): Return => {
  const [setRol, { isLoading: isUpdating }] = useSetRolMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const toROL = toNavIdent === null ? null : (rol.find((m) => m.navIdent === toNavIdent) ?? null);

      const name = toROL === null ? 'fjernet' : `satt til ${formatEmployeeNameAndIdFallback(toROL, 'felles kø')}`;

      try {
        const { modified } = await setRol({ oppgaveId, employee: toROL }).unwrap();
        const timestamp = parseISO(modified).getTime();

        successToast({
          testId: 'oppgave-set-rol-success-toast',
          oppgaveId,
          label: 'Rådgivende overlege',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
          timestamp,
        });
      } catch {
        // Error already handled in RTKQ file.
      }
    },
    [rol, oppgaveId, setRol],
  );

  return { onChange, isUpdating };
};
