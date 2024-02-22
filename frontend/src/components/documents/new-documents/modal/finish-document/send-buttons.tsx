import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { useContext } from 'react';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { FinishProps } from './types';

export const SendButtons = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle, mottakerList } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [setMottakerList] = useSetMottakerListMutation();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();
  const { close, setValidationErrors } = useContext(ModalContext);
  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(document);

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

    if (mottakerList.length === 0 && suggestedBrevmottakere.length !== 1) {
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
      if (mottakerList.length === 0 && suggestedBrevmottakere.length === 1) {
        await setMottakerList({
          oppgaveId: data.id,
          dokumentId,
          mottakerList: suggestedBrevmottakere,
        });
      }
      await finish({ dokumentId, oppgaveId: data.id });
      remove(dokumentId, document);
      close();
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
