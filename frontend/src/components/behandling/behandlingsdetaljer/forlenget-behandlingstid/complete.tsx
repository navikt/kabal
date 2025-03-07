import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import {
  useCompleteMutation,
  useGetOrCreateQuery,
  useSetReceiversMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { isApiError } from '@app/types/errors';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  id: string;
  onClose: () => void;
  setError: (error: string) => void;
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
        <Button
          onClick={() => {
            if (data.behandlingstid.varsletBehandlingstidUnits === null && data.behandlingstid.varsletFrist === null) {
              return setError('Ny behandlingstid eller ny frist må være satt');
            }

            setShowConfirm(true);
          }}
          size="small"
          variant="primary"
        >
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
              if (data.receivers.length === 0 && reachable.length > 0) {
                await setReceivers({ mottakerList: reachable, id }).unwrap();
              }

              try {
                await complete({ id, onClose: onClose }).unwrap();
              } catch (e) {
                if (typeof e === 'object' && e !== null && 'data' in e && isApiError(e.data)) {
                  setError(e.data.title);
                }
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
