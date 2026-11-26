import { TextField } from '@navikt/ds-react';
import { useState } from 'react';
import { BehandlingSection } from '@/components/behandling/behandlingsdetaljer/behandling-section';
import { CopySaksnummerButton } from '@/components/copy-button/copy-saksnummer-button';
import { isObject } from '@/functions/object';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useCanEditBehandling } from '@/hooks/use-can-edit';
import { useFieldName } from '@/hooks/use-field-name';
import { useValidationError } from '@/hooks/use-validation-error';
import { useSetSaksnummerHosTrygderettenMutation } from '@/redux-api/oppgaver/mutations/behandling-dates';
import { isKabalApiErrorData } from '@/types/errors';
import type { IOppgavebehandling } from '@/types/oppgavebehandling/oppgavebehandling';

export const SaksnummerHosTrygderettenInput = () => {
  const { data: behandling, isSuccess } = useOppgave();

  if (!isSuccess || !('trygderettenSaksnummer' in behandling)) {
    return null;
  }

  return <Loaded behandling={behandling} />;
};

const Loaded = ({ behandling }: { behandling: IOppgavebehandling & { trygderettenSaksnummer: string | null } }) => {
  const [editSaksnummer, { error }] = useSetSaksnummerHosTrygderettenMutation();
  const validationError = useValidationError('trygderettenSaksnummer');
  const canEdit = useCanEditBehandling();
  const [saksnummer, setSaksnummer] = useState(behandling.trygderettenSaksnummer ?? '');
  const fieldName = useFieldName('trygderettenSaksnummer');

  if (!canEdit) {
    return (
      <BehandlingSection label={fieldName}>
        {behandling.trygderettenSaksnummer === null ? (
          'Ikke satt'
        ) : (
          <CopySaksnummerButton saksnummer={behandling.trygderettenSaksnummer} />
        )}
      </BehandlingSection>
    );
  }

  const mutationError =
    hasData(error) && isKabalApiErrorData(error.data) ? (error.data.detail ?? error.data.title) : null;

  return (
    <TextField
      label={fieldName}
      size="small"
      onBlur={({ target }) => editSaksnummer({ oppgaveId: behandling.id, trygderettenSaksnummer: target.value })}
      error={validationError ?? mutationError}
      value={saksnummer}
      onChange={({ target }) => setSaksnummer(target.value)}
      placeholder="Årstall etterfulgt av et løpenummer, for eksempel 2026123"
    />
  );
};

const hasData = (error: unknown): error is { data: Record<string, unknown> } =>
  isObject(error) && 'data' in error && isObject(error.data);
