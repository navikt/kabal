import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useSuggestedBrevmottakere } from '@app/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DistribusjonsType } from '@app/types/documents/documents';
import { NO_RECEIVERS_ERROR } from '@app/types/documents/validation';
import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Confirm } from './confirm';
import { VALIDATION_ERROR_MESSAGES } from './error-messages';
import { type FinishProps, isSmartDocumentValidatonError } from './types';

export const SendButtons = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle, mottakerList, dokumentTypeId } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [setMottakerList] = useSetMottakerListMutation();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();
  const { close, setValidationErrors } = useContext(ModalContext);
  const [suggestedBrevmottakere] = useSuggestedBrevmottakere(document.mottakerList, document.templateId);
  const reachableSuggestedReceivers = suggestedBrevmottakere.filter((s) => s.reachable);

  if (oppgaveIsLoading || data === undefined) {
    return null;
  }

  const onValidate = async () => {
    if (typeof data?.id !== 'string') {
      return false;
    }

    setValidationErrors([]);

    // Ekspedisjonsbrev til trygderetten will always have Trygderetten as a receiver
    if (mottakerList.length === 0 && dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN) {
      if (reachableSuggestedReceivers.length !== 1) {
        setValidationErrors([
          {
            dokumentId,
            title: documentTitle,
            errors: [{ type: NO_RECEIVERS_ERROR, message: 'Utsendingen må ha minst én mottaker' }],
          },
        ]);

        return false;
      }

      await setMottakerList({
        oppgaveId: data.id,
        dokumentId,
        mottakerList: reachableSuggestedReceivers,
      });
    }

    const validation = await validate({ dokumentId, oppgaveId: data.id }).unwrap();

    if (validation?.length > 0 && validation.some((v) => v.errors.length > 0)) {
      const errors = validation.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors.map(({ type }) => ({ type, message: VALIDATION_ERROR_MESSAGES[type] })),
      }));

      setValidationErrors(errors);

      return false;
    }

    return true;
  };

  if (document.isMarkertAvsluttet) {
    return (
      <Alert variant="info" size="small">
        Dokumentet er under journalføring og utsending.
      </Alert>
    );
  }

  const onFinish = async () => {
    try {
      if (mottakerList.length === 0 && reachableSuggestedReceivers.length === 1) {
        await setMottakerList({
          oppgaveId: data.id,
          dokumentId,
          mottakerList: reachableSuggestedReceivers,
        });
      }

      await finish({ dokumentId, oppgaveId: data.id }).unwrap();

      remove(dokumentId, document);
      close();
    } catch (e) {
      if (isSmartDocumentValidatonError(e)) {
        const validationErrors = e.data.documents.map((d) => ({
          dokumentId: d.dokumentId,
          title: documents.find((doc) => doc.id === d.dokumentId)?.tittel ?? d.dokumentId,
          errors: d.errors.map(({ type }) => ({ type, message: VALIDATION_ERROR_MESSAGES[type] })),
        }));

        setValidationErrors(validationErrors);
      }
    }
  };

  return (
    <Confirm
      actionText="Send ut"
      onValidate={onValidate}
      onFinish={onFinish}
      isValidating={isValidating}
      isFinishing={isFinishing}
    />
  );
};
