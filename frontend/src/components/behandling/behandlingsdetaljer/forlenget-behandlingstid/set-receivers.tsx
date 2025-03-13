import { setErrorMessage } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { Receivers } from '@app/components/receivers/receivers';
import { useSetReceiversMutation } from '@app/redux-api/forlenget-behandlingstid';
import type { IMottaker } from '@app/types/documents/documents';
import { UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { UTVIDET_BEHANDLINGSTID_FIELD_NAMES } from '@app/types/field-names';
import { ErrorMessage, Heading, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: IMottaker[];
  id: string;
}

export const SetReceivers = ({ value, id }: Props) => {
  const [setReceivers] = useSetReceiversMutation();
  const [error, setError] = useState<string>();

  return (
    <VStack gap="2" id={UtvidetBehandlingstidFieldName.Mottakere} as="section">
      <Heading size="xsmall">{UTVIDET_BEHANDLINGSTID_FIELD_NAMES[UtvidetBehandlingstidFieldName.Mottakere]}</Heading>
      <Receivers
        mottakerList={value}
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
