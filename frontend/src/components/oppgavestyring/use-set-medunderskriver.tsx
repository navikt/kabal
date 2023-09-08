import { Button } from '@navikt/ds-react';
import React, { useCallback } from 'react';
import { styled } from 'styled-components';
import { getFixedCacheKey } from '@app/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { useSetMedunderskriverMutation } from '@app/redux-api/oppgaver/mutations/set-medunderskriver';
import { INavEmployee } from '@app/types/oppgave-common';
import { toast } from '../toast/store';

type OnChange = (toNavIdent: string | null, fromNavIdent: string | null) => Promise<void>;

interface Return {
  onChange: OnChange;
  isUpdating: boolean;
}

const EMPTY_MEDUNDERSKRIVERE: INavEmployee[] = [];

export const useSetMedunderskriver = (
  oppgaveId: string,
  medunderskrivere: INavEmployee[] = EMPTY_MEDUNDERSKRIVERE,
): Return => {
  const [setMedunderskriver, { isLoading: isUpdating }] = useSetMedunderskriverMutation({
    fixedCacheKey: getFixedCacheKey(oppgaveId),
  });

  const onChange: OnChange = useCallback(
    async (toNavIdent, fromNavIdent) => {
      const medunderskriverName =
        toNavIdent === null
          ? 'fjernet'
          : `satt til ${medunderskrivere.find((m) => m.navIdent === toNavIdent)?.navn} (${toNavIdent})`;

      try {
        await setMedunderskriver({ oppgaveId, navIdent: toNavIdent });

        toast.success(
          <div data-testid="oppgave-medunderskriver-toast" data-oppgaveid={oppgaveId}>
            <span>Medunderskriver {medunderskriverName}.</span>
            <ButtonRow>
              <Button size="small" variant="tertiary" onClick={() => onChange(fromNavIdent, toNavIdent)}>
                Angre
              </Button>
            </ButtonRow>
          </div>,
        );
      } catch (e) {
        toast.error(
          <div data-testid="oppgave-medunderskriver-toast" data-oppgaveid={oppgaveId}>
            <span>
              Kunne ikke sette {medunderskriverName} ({toNavIdent}) som medunderskriver.
            </span>
            <ButtonRow>
              <Button size="small" variant="tertiary" onClick={() => onChange(toNavIdent, fromNavIdent)}>
                Prøv igjen
              </Button>
            </ButtonRow>
          </div>,
        );
      }
    },
    [medunderskrivere, oppgaveId, setMedunderskriver],
  );

  return { onChange, isUpdating };
};

const ButtonRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  column-gap: 8px;
`;
