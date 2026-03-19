import { ErrorMessage, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { setErrorMessage } from '@/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { Receivers } from '@/components/receivers/receivers';
import { useSetReceiversMutation } from '@/redux-api/forlenget-behandlingstid';
import type { IMottaker } from '@/types/documents/documents';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES, UtvidetBehandlingstidFieldName } from '@/types/field-names';

interface Props {
  value: IMottaker[];
  id: string;
}

export const SetReceivers = ({ value, id }: Props) => {
  const [setReceivers, { isLoading }] = useSetReceiversMutation();
  const [error, setError] = useState<string>();

  return (
    <VStack gap="space-8" id={UtvidetBehandlingstidFieldName.Mottakere} as="section">
      <Heading size="xsmall">{UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.Mottakere]}</Heading>
      <Receivers
        mottakerList={value}
        isLoading={isLoading}
        setMottakerList={async (mottakerList) => {
          try {
            await setReceivers({ mottakerList, id }).unwrap();
            setError(undefined);
          } catch (e) {
            setErrorMessage(e, setError);
          }
        }}
      />
      {error === undefined ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
    </VStack>
  );
};
