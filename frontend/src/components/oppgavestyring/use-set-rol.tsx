import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { successToast } from '@app/components/oppgavestyring/toasts';
import type { OnChange } from '@app/components/oppgavestyring/types';
import { EMPTY_MEDUNDERSKRIVERE, type Return } from '@app/components/oppgavestyring/use-set-medunderskriver';
import { formatEmployeeNameAndIdFallback } from '@app/domain/employee-name';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { useSetRolFlowStateMutation } from '@app/redux-api/oppgaver/mutations/set-rol-flowstate';
import type { INavEmployee } from '@app/types/bruker';
import { FlowState } from '@app/types/oppgave-common';
import { parseISO } from 'date-fns';
import { useCallback, useRef } from 'react';

export const useSetRol = (oppgaveId: string, rol: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE): Return => {
  const [setRol, { isLoading: isSettingEmployee }] = useSetRolMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });
  const [setRolState, { isLoading: isSettingFlowState }] = useSetRolFlowStateMutation();

  const isUpdating = isSettingEmployee || isSettingFlowState;

  const onChangeRef = useRef<OnChange>(() => Promise.resolve());

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const toROL = toNavIdent === null ? null : (rol.find((m) => m.navIdent === toNavIdent) ?? null);

      const name = toROL === null ? 'fjernet' : `satt til ${formatEmployeeNameAndIdFallback(toROL, 'felles kø')}`;

      try {
        const { modified } = await setRol({ oppgaveId, employee: toROL }).unwrap();
        const timestamp = parseISO(modified).getTime();

        if (toROL !== null) {
          await setRolState({ oppgaveId, flowState: FlowState.SENT }).unwrap();
        }

        successToast({
          testId: 'oppgave-set-rol-success-toast',
          oppgaveId,
          label: 'Rådgivende overlege',
          fromNavIdent,
          toNavIdent,
          onChange: onChangeRef.current,
          name,
          timestamp,
        });
      } catch {
        // Error already handled in RTKQ file.
      }
    },
    [rol, oppgaveId, setRol, setRolState],
  );

  onChangeRef.current = onChange;

  return { onChange, isUpdating };
};
