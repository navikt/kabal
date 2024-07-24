import { useCallback } from 'react';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { errorToast, successToast } from '@app/components/oppgavestyring/toasts';
import { OnChange } from '@app/components/oppgavestyring/types';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { INavEmployee } from '@app/types/bruker';
import { EMPTY_MEDUNDERSKRIVERE, Return } from './use-set-medunderskriver';

export const useSetRol = (oppgaveId: string, rol: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE): Return => {
  const [setRol, { isLoading: isUpdating }] = useSetRolMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const toROL = toNavIdent === null ? null : (rol.find((m) => m.navIdent === toNavIdent) ?? null);

      const name = toROL === null ? 'fjernet' : `satt til ${formatEmployeeNameAndIdFallback(toROL, 'felles kø')}`;

      try {
        await setRol({ oppgaveId, employee: toROL });

        successToast({
          testId: 'oppgave-set-rol-success-toast',
          oppgaveId,
          label: 'Rådgivende overlege',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
        });
      } catch (e) {
        errorToast({
          testId: 'oppgave-set-rol-error-toast',
          oppgaveId,
          label: 'rådgivende overlege',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
        });
      }
    },
    [rol, oppgaveId, setRol],
  );

  return { onChange, isUpdating };
};
