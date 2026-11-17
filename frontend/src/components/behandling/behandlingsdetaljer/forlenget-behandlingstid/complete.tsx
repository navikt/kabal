import { Button, ErrorMessage, HStack, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';
import { type IValidationSection, isReduxValidationResponse, SectionKey } from '@/functions/error-type-guard';
import { useSuggestedBrevmottakere } from '@/hooks/use-suggested-brevmottakere';
import {
  useCompleteMutation,
  useGetOrCreateQuery,
  useSetReceiversMutation,
} from '@/redux-api/forlenget-behandlingstid';
import { UtvidetBehandlingstidFieldName } from '@/types/field-names';

interface Props {
  id: string;
  onClose: () => void;
  setError: (error: IValidationSection[]) => void;
}

export const Complete = ({ id, onClose, setError }: Props) => {
  const [complete, { isLoading }] = useCompleteMutation();
  const { data, isSuccess } = useGetOrCreateQuery(id);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    brevmottakere,
    isLoading: brevmottakereIsLoading,
    error,
  } = useSuggestedBrevmottakere(
    data === undefined || data.doNotSendLetter || data.receivers.length > 0
      ? skipToken
      : { mottakerList: data.receivers },
  );
  const [setReceivers] = useSetReceiversMutation();

  if (!isSuccess) {
    return null;
  }

  if (error !== null) {
    return <ErrorMessage size="small">{error}</ErrorMessage>;
  }

  if (brevmottakereIsLoading) {
    return <Loader size="small" />;
  }

  const reachable = brevmottakere.filter((s) => s.reachable);

  return (
    <HStack gap="space-8" align="center">
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
          <Button
            data-color="neutral"
            size="small"
            variant="secondary"
            onClick={() => setShowConfirm(false)}
            disabled={isLoading}
          >
            Avbryt
          </Button>
        </>
      ) : null}
    </HStack>
  );
};
