import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { errorToast, successToast } from '@app/components/oppgavestyring/toasts';
import type { OnChange } from '@app/components/oppgavestyring/types';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import type { INavEmployee } from '@app/types/bruker';
import { parseISO } from 'date-fns';
import { useCallback } from 'react';

export interface Return {
  onChange: OnChange;
  isUpdating: boolean;
}

export const EMPTY_MEDUNDERSKRIVERE: INavEmployee[] = [];

export const useSetMedunderskriver = (
  oppgaveId: string,
  medunderskrivere: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE,
): Return => {
  const [setMedunderskriver, { isLoading: isUpdating }] = useSetMedunderskriverMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const toMedunderskriver =
        toNavIdent === null ? null : (medunderskrivere.find((m) => m.navIdent === toNavIdent) ?? null);

      const name =
        toMedunderskriver === null
          ? 'fjernet'
          : `satt til ${formatEmployeeNameAndIdFallback(toMedunderskriver, 'ingen')}`;

      try {
        const { modified } = await setMedunderskriver({ oppgaveId, employee: toMedunderskriver }).unwrap();
        const timestamp = parseISO(modified).getTime();

        successToast({
          testId: 'oppgave-set-medunderskriver-success-toast',
          oppgaveId,
          label: 'Medunderskriver',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
          timestamp,
        });
      } catch {
        errorToast({
          testId: 'oppgave-set-medunderskriver-error-toast',
          oppgaveId,
          label: 'medunderskriver',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
        });
      }
    },
    [medunderskrivere, oppgaveId, setMedunderskriver],
  );

  return { onChange, isUpdating };
};
