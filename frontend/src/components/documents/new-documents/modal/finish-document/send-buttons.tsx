import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext } from 'react';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { FinishProps } from './types';

export const SendButtons = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();
  const { close, customBrevmottakerList, selectedPartBrevmottakerIds, setValidationErrors } = useContext(ModalContext);

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

    if (selectedPartBrevmottakerIds.length === 0 && customBrevmottakerList.length === 0) {
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
      const brevmottakerIds = customBrevmottakerList.map(({ id }) => id).concat(selectedPartBrevmottakerIds);

      await finish({ dokumentId, oppgaveId: data.id, brevmottakerIds }).unwrap();

      close();

      remove(dokumentId, document);
    } catch (e) {
      console.error(e);
    }
  };

  if (document.isMarkertAvsluttet) {
    return (
      <Alert variant="info" size="small">
        Dokumentet er under journalføring og utsending.
      </Alert>
    );
  }

  return <Confirm actionText="Send ut" onClick={onClick} isValidating={isValidating} isFinishing={isFinishing} />;
};
