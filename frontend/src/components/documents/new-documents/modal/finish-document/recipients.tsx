import { Alert, Heading } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { CustomRecipients } from '@app/components/documents/new-documents/modal/finish-document/custom-recipients';
import { isSendError } from '@app/components/documents/new-documents/modal/finish-document/is-send-error';
import { SelectRecipients } from '@app/components/documents/new-documents/modal/finish-document/select-recipients';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { StyledFinishDocument } from './styled-components';
import { FinishProps } from './types';

export const Receipients = ({ document }: FinishProps) => {
  const [, { error: finishError }] = useFinishDocumentMutation({
    fixedCacheKey: document.id,
  });
  const { data, isLoading: oppgaveIsLoading } = useOppgave();

  const {
    setCustomBrevmottakerList,
    setSelectedPartBrevmottakerIds,
    selectedPartBrevmottakerIds,
    customBrevmottakerList,
    partBrevmottakere,
  } = useContext(ModalContext);

  const sendErrors = useMemo(() => {
    if (isSendError(finishError)) {
      return finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [];
    }

    return [];
  }, [finishError]);

  if (oppgaveIsLoading || typeof data === 'undefined') {
    return null;
  }

  return (
    <StyledFinishDocument>
      <Heading size="xsmall">{`Send brevet «${document.tittel}» til`}</Heading>
      {document.isMarkertAvsluttet ? null : (
        <SelectRecipients
          recipients={partBrevmottakere}
          selectedBrevmottakerIds={selectedPartBrevmottakerIds}
          setSelectedBrevmottakerIds={setSelectedPartBrevmottakerIds}
          label={`Send brevet «${document.tittel}» til`}
          sendErrors={sendErrors}
        />
      )}

      {document.isMarkertAvsluttet ? null : (
        <CustomRecipients
          brevMottakere={customBrevmottakerList}
          setBrevMottakere={setCustomBrevmottakerList}
          sendErrors={sendErrors}
        />
      )}

      {sendErrors?.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}
    </StyledFinishDocument>
  );
};
