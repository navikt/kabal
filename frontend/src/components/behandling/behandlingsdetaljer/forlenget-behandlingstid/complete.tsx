import { type IValidationSection, isReduxValidationResponse, SectionKey } from '@app/functions/error-type-guard';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import {
  useCompleteMutation,
  useGetOrCreateQuery,
  useSetReceiversMutation,
} from '@app/redux-api/forlenget-behandlingstid';
import { UtvidetBehandlingstidFieldName } from '@app/types/field-names';
import { Button, HStack } from '@navikt/ds-react';
import { useState } from 'react';

interface Props {
  id: string;
  onClose: () => void;
  setError: (error: IValidationSection[]) => void;
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
          Endre frist{data.doNotSendLetter ? '' : ' og send brev'}
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
                if (!data.doNotSendLetter && data.receivers.length === 0 && reachable.length === 1) {
                  await setReceivers({ mottakerList: reachable, id }).unwrap();
                }

                await complete({ id, onClose, doNotSendLetter: data.doNotSendLetter }).unwrap();
                setError([]);
              } catch (e) {
                if (isReduxValidationResponse(e)) {
                  setError(e.data.sections);
                } else {
                  setError([
                    {
                      section: SectionKey.FORLENGET_BEHANDLINGSTID_DRAFT,
                      properties: [
                        { reason: 'Ukjent feil', field: UtvidetBehandlingstidFieldName.ForlengetBehandlingstidDraft },
                      ],
                    },
                  ]);
                }
              }
            }}
          >
            Bekreft endring av frist{data.doNotSendLetter ? '' : ' og send brev'}
          </Button>
          <Button size="small" variant="secondary-neutral" onClick={() => setShowConfirm(false)} disabled={isLoading}>
            Avbryt
          </Button>
        </>
      ) : null}
    </HStack>
  );
};
