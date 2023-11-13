import { useCallback } from 'react';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { errorToast, successToast } from '@app/components/oppgavestyring/toasts';
import { OnChange } from '@app/components/oppgavestyring/types';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { INavEmployee } from '@app/types/oppgave-common';

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
      const name =
        toNavIdent === null
          ? 'fjernet'
          : `satt til ${medunderskrivere.find((m) => m.navIdent === toNavIdent)?.navn} (${toNavIdent})`;

      try {
        await setMedunderskriver({ oppgaveId, navIdent: toNavIdent });

        successToast({
          testId: 'oppgave-set-medunderskriver-success-toast',
          oppgaveId,
          label: 'Medunderskriver',
          fromNavIdent,
          toNavIdent,
          onChange,
          name,
        });
      } catch (e) {
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