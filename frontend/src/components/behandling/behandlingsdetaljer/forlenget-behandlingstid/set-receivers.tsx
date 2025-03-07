import { setErrorMessage } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { Receivers } from '@app/components/receivers/receivers';
import { useSetReceiversMutation } from '@app/redux-api/forlenget-behandlingstid';
import type { IMottaker } from '@app/types/documents/documents';
import { ErrorMessage, VStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  value: IMottaker[];
  id: string;
}

export const SetReceivers = ({ value, id }: Props) => {
  const [setReceivers] = useSetReceiversMutation();
  const [error, setError] = useState<string>();

  return (
    <VStack gap="2">
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
