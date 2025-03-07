import { setErrorMessage } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/use-debounce';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import {
  useCompleteMutation,
  useGetOrCreateQuery,
  useSetReceiversMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  id: string;
  onClose: () => void;
  setError: (error: string | undefined) => void;
}

export const Complete = ({ id, onClose, setError }: Props) => {
  const [complete, { isLoading }] = useCompleteMutation();
  const { data } = useGetOrCreateQuery(id);
  const [showConfirm, setShowConfirm] = useState(false);
  const [suggested] = useSuggestedBrevmottakere(data?.receivers ?? []);
  const reachable = suggested.filter((s) => s.reachable);
  const [setReceivers] = useSetReceiversMutation();

  if (data === undefined) {
    return null;
  }

  return (
    <HStack gap="2" align="center">
      {showConfirm ? null : (
        <Button onClick={() => setShowConfirm(true)} size="small" variant="primary">
          Endre frist og send brev
        </Button>
      )}

      {showConfirm ? (
        <>
          <Button
            size="small"
            variant="primary"
            loading={isLoading}
            onClick={async () => {
              try {
                if (data.receivers.length === 0) {
                  if (reachable.length === 1) {
                    await setReceivers({ mottakerList: reachable, id }).unwrap();
                  } else {
                    return setError('Brevet må ha minst én mottaker');
                  }
                }

                await complete({ id, onClose: onClose }).unwrap();
                setError(undefined);
              } catch (e) {
                setErrorMessage(e, setError, 'Feil ved utsending av brev om lengre saksbehandlingstid.');
              }
            }}
          >
            Bekreft endring av frist og send brev
          </Button>
          <Button size="small" variant="secondary" onClick={() => setShowConfirm(false)} disabled={isLoading}>
            Avbryt
          </Button>
        </>
      ) : null}
    </HStack>
  );
};
