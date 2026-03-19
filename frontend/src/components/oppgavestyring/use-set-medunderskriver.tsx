import { parseISO } from 'date-fns';
import { useCallback, useRef } from 'react';
import { getFixedCacheKey } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { successToast } from '@/components/oppgavestyring/toasts';
import type { OnChange } from '@/components/oppgavestyring/types';
import { formatEmployeeNameAndIdFallback } from '@/domain/employee-name';
import { useSetMedunderskriverMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver';
import { useSetMedunderskriverFlowStateMutation } from '@/redux-api/oppgaver/mutations/set-medunderskriver-flowstate';
import type { INavEmployee } from '@/types/bruker';
import { FlowState } from '@/types/oppgave-common';

export interface Return {
  onChange: OnChange;
  isUpdating: boolean;
}

export const EMPTY_MEDUNDERSKRIVERE: INavEmployee[] = [];

export const useSetMedunderskriver = (
  oppgaveId: string,
  medunderskrivere: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE,
): Return => {
  const [setMedunderskriver, { isLoading: isSettingEmployee }] = useSetMedunderskriverMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });
  const [setMedunderskriverFlowState, { isLoading: isSettingFlowState }] = useSetMedunderskriverFlowStateMutation();

  const isUpdating = isSettingEmployee || isSettingFlowState;

  const onChangeRef = useRef<OnChange>(() => Promise.resolve());

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

        if (toMedunderskriver !== null) {
          await setMedunderskriverFlowState({ oppgaveId, flowState: FlowState.SENT }).unwrap();
        }

        successToast({
          testId: 'oppgave-set-medunderskriver-success-toast',
          oppgaveId,
          label: 'Medunderskriver',
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
    [medunderskrivere, oppgaveId, setMedunderskriver, setMedunderskriverFlowState],
  );

  onChangeRef.current = onChange;

  return { onChange, isUpdating };
};
