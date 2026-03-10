import { LovhjemmelSelect } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/lovhjemmel-select';
import { SelectedHjemlerList } from '@app/components/behandling/behandlingsdetaljer/lovhjemmel/selected-hjemler-list';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@app/hooks/use-can-edit';
import { useValidationError } from '@app/hooks/use-validation-error';
import { useUpdateRegistreringshjemlerMutation } from '@app/redux-api/oppgaver/mutations/set-registreringshjemler';
import { HelpText, HStack, Label } from '@navikt/ds-react';

const EMPTY_LIST: string[] = [];

export const Lovhjemmel = () => {
  const [updateHjemler] = useUpdateRegistreringshjemlerMutation();
  const { data: oppgave } = useOppgave();
  const canEdit = useCanEditBehandling();
  const validationError = useValidationError('hjemmel');

  const selected = oppgave?.resultat.hjemmelIdSet ?? EMPTY_LIST;

  if (oppgave === undefined) {
    return null;
  }

  const onLovhjemmelChange = (hjemmelIdSet: string[]) => updateHjemler({ oppgaveId: oppgave.id, hjemmelIdSet });

  return (
    <>
      <HStack align="center" gap="space-8" marginBlock="space-0 space-8">
        <Label size="small">Utfallet er basert på lovhjemmel</Label>
        <HelpText>
          Her setter du hjemlene som utfallet i saken er basert på. Hjemlene du setter her påvirker også hvilke gode
          formuleringer du kan sette inn i brevet, og hvilket regelverk som dukker opp i vedlegget nederst.
        </HelpText>
      </HStack>
      {canEdit ? (
        <LovhjemmelSelect
          selected={oppgave.resultat.hjemmelIdSet}
          onChange={onLovhjemmelChange}
          error={validationError}
        >
          Hjemmel
        </LovhjemmelSelect>
      ) : null}
      <SelectedHjemlerList selected={selected} />
    </>
  );
};
