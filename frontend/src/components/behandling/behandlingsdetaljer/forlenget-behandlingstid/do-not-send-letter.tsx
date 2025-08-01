import { useDebounce } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import {
  useGetOrCreateQuery,
  useSetDoNotSendBrevMutation,
  useSetReasonNoLetterMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES, UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { Alert, BoxNew, Checkbox, ErrorMessage, Textarea, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

export const DoNotSendLetter = () => {
  const id = useOppgaveId();
  const { data, isSuccess } = useGetOrCreateQuery(id ?? skipToken);
  const [setDoNotSendLetter, { isLoading }] = useSetDoNotSendBrevMutation();

  if (id === skipToken || !isSuccess) {
    return null;
  }

  return (
    <VStack gap="4">
      <BoxNew
        background="info-soft"
        borderColor="info"
        padding="2"
        borderRadius="medium"
        borderWidth="1"
        shadow="dialog"
      >
        <Checkbox
          onChange={({ target }) => setDoNotSendLetter({ id, doNotSendLetter: target.checked })}
          size="small"
          checked={data.doNotSendLetter}
          disabled={isLoading}
          id={UtvidetBehandlingstidFieldName.DoNotSendLetter}
        >
          {UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.DoNotSendLetter]}
        </Checkbox>
      </BoxNew>
      {data.doNotSendLetter ? (
        <>
          <Alert size="small" variant="info" inline>
            Husk at du må varsle bruker om endret varslet frist. Du bør kun endre varslet frist uten å sende brev dersom
            du allerede har varslet på annen måte.
          </Alert>
          <ReasonNoLetter value={data.reasonNoLetter} id={id} />
        </>
      ) : null}
    </VStack>
  );
};

interface Props {
  value: string | null;
  id: string;
}

const ReasonNoLetter = ({ value, id }: Props) => {
  const [setValue] = useSetReasonNoLetterMutation();
  const [tempValue, setTempValue] = useState(value ?? '');
  const [error, setError] = useState<string>();

  const skip = tempValue === value || (tempValue === '' && value === null);
  const action = () => setValue({ id, reasonNoLetter: tempValue === '' ? null : tempValue });
  useDebounce(action, skip, tempValue, 500);

  return (
    <VStack gap="2">
      <Textarea
        id={UtvidetBehandlingstidFieldName.ReasonNoLetter}
        minRows={3}
        maxRows={3}
        label={UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.ReasonNoLetter]}
        hideLabel
        size="small"
        placeholder="Skriv kort hvordan du har varslet på annen måte"
        value={tempValue}
        onChange={({ target }) => setTempValue(target.value)}
        onBlur={() => {
          if (tempValue === '') {
            setError('Du må skrive en begrunnelse');
          } else {
            setError(undefined);
          }
        }}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
