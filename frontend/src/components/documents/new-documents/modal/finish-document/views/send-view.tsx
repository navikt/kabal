import { Alert, Heading } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useMemo, useState } from 'react';
import { CustomRecipients } from '@app/components/documents/new-documents/modal/finish-document/views/custom-recipients';
import { isSendError } from '@app/components/documents/new-documents/modal/finish-document/views/is-send-error';
import { Recipients } from '@app/components/documents/new-documents/modal/finish-document/views/recipients';
import { ModalContext } from '@app/components/documents/new-documents/new-document/toggle-modal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { IBrevmottaker, useBrevmottakere } from '@app/hooks/use-brevmottakere';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { IPart } from '@app/types/oppgave-common';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledFinishDocument } from './styled-components';
import { FinishProps } from './types';

export const SendView = ({ document }: FinishProps) => {
  const [brevmottakere, isLoading] = useBrevmottakere();

  if (isLoading) {
    return null;
  }

  return <SendViewContent document={document} partBrevmottakere={brevmottakere} />;
};

interface SendViewContentProps extends FinishProps {
  partBrevmottakere: IBrevmottaker[];
}

const SendViewContent = ({ document, partBrevmottakere }: SendViewContentProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const [finish, { isLoading: isFinishing, error: finishError }] = useFinishDocumentMutation();
  const { data, isLoading: oppgaveIsLoading } = useOppgave();

  const [firstPartBrevmottaker] = partBrevmottakere;

  const [selectedPartBrevmottakerIds, setSelectedBrevmottakerIds] = useState<string[]>(
    partBrevmottakere.length === 1 && firstPartBrevmottaker !== undefined ? [firstPartBrevmottaker.id] : [],
  );

  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();
  const [customBrevmottakerIds, setCustomBrevmottakerIds] = useState<IPart[]>([]);
  const { close } = useContext(ModalContext);

  const sendErrors = useMemo(() => {
    if (isSendError(finishError)) {
      return finishError.data.sections.find((s) => s.section === 'mottakere')?.properties ?? [];
    }

    return [];
  }, [finishError]);

  if (oppgaveIsLoading || typeof data === 'undefined') {
    return null;
  }

  const onClick = async () => {
    if (typeof data?.id !== 'string') {
      return;
    }

    setValidationErrors([]);

    const validation = await validate({ dokumentId, oppgaveId: data.id }).unwrap();

    if (validation?.length !== 0 && validation.some((v) => v.errors.length !== 0)) {
      const errors = validation.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors.map((e) => ERROR_MESSAGES[e.type]),
      }));

      setValidationErrors(errors);

      return;
    }

    if (selectedPartBrevmottakerIds.length === 0 && customBrevmottakerIds.length === 0) {
      setValidationErrors([
        {
          dokumentId,
          title: documentTitle,
          errors: ['Utsendingen må ha minst én mottaker'],
        },
      ]);

      return;
    }

    try {
      const brevmottakerIds = customBrevmottakerIds.map(({ id }) => id).concat(selectedPartBrevmottakerIds);

      await finish({ dokumentId, oppgaveId: data.id, brevmottakerIds }).unwrap();

      close();

      remove(dokumentId, document);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StyledFinishDocument>
      <Heading size="xsmall">{`Send brevet "${documentTitle}" til`}</Heading>
      {document.isMarkertAvsluttet ? null : (
        <Recipients
          recipients={partBrevmottakere}
          selectedBrevmottakerIds={selectedPartBrevmottakerIds}
          setSelectedBrevmottakerIds={setSelectedBrevmottakerIds}
          label={`Send brevet "${documentTitle}" til`}
          sendErrors={sendErrors}
        />
      )}

      {document.isMarkertAvsluttet ? null : (
        <CustomRecipients
          brevMottakere={customBrevmottakerIds}
          setBrevMottakere={setCustomBrevmottakerIds}
          sendErrors={sendErrors}
        />
      )}

      {sendErrors?.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}

      {document.isMarkertAvsluttet ? (
        <Alert variant="info" size="small">
          Dokumentet er under journalføring og utsending.
        </Alert>
      ) : (
        <Confirm actionText="Send ut" onClick={onClick} isValidating={isValidating} isFinishing={isFinishing} />
      )}

      <Errors errors={validationErrors} />
    </StyledFinishDocument>
  );
};
