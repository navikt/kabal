import { parseISO } from 'date-fns';
import { useCallback, useRef } from 'react';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { successToast } from '@/components/oppgavestyring/toasts';
import type { OnChange } from '@/components/oppgavestyring/types';
import { EMPTY_MEDUNDERSKRIVERE, type Return } from '@/components/oppgavestyring/use-set-medunderskriver';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import { useSetRolMutation } from '@/redux-api/oppgaver/mutations/set-rol';
import { useSetRolFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-rol-flowstate';
import type { INavEmployee } from '@/types/bruker';
import { FlowState } from '@/types/oppgave-common';

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

      try {
        const { modified } = await setRol({ oppgaveId, employee: toROL }).unwrap();
        const timestamp = parseISO(modified).getTime();

        await setRolState({ oppgaveId, flowState: FlowState.SENT }).unwrap();

        successToast({
          testId: 'oppgave-set-rol-success-toast',
          oppgaveId,
          label: 'Rådgivende overlege',
          fromNavIdent,
          toNavIdent,
          onChange: onChangeRef.current,
          name: `satt til ${formatEmployeeNameAndIdFallback(toROL, 'felles kø')}`,
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
