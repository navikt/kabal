import { useCallback } from 'react';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { errorToast, successToast } from '@app/components/oppgavestyring/toasts';
import { OnChange } from '@app/components/oppgavestyring/types';
import { useSetRolMutation } from '@app/redux-api/oppgaver/mutations/set-rol';
import { INavEmployee } from '@app/types/bruker';
import { EMPTY_MEDUNDERSKRIVERE, Return } from './use-set-medunderskriver';

export const useSetRol = (oppgaveId: string, rol: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE): Return => {
  const [setRol, { isLoading: isUpdating }] = useSetRolMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const name =
        toNavIdent === null
          ? 'fjernet'
          : `satt til ${rol.find((m) => m.navIdent === toNavIdent)?.navn} (${toNavIdent})`;

      try {
        await setRol({ oppgaveId, navIdent: toNavIdent });

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
