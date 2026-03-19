import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Confirm } from '@/components/documents/new-documents/modal/finish-document/confirm';
import { VALIDATION_ERROR_MESSAGES } from '@/components/documents/new-documents/modal/finish-document/error-messages';
import {
  type FinishProps,
  isSmartDocumentValidatonError,
} from '@/components/documents/new-documents/modal/finish-document/types';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useSmartEditorActiveDocument } from '@/hooks/settings/use-setting';
import { useSuggestedBrevmottakere } from '@/hooks/use-suggested-brevmottakere';
import { useFinishDocumentMutation, useSetMottakerListMutation } from '@/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@/redux-api/oppgaver/queries/documents';
import { DistribusjonsType } from '@/types/documents/documents';
import { NO_RECEIVERS_ERROR } from '@/types/documents/validation';

export const SendButtons = ({ document, disabled, ...rest }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle, mottakerList, dokumentTypeId } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [setMottakerList] = useSetMottakerListMutation();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const { value: activeSmartEditor, remove: removeActiveSmartEditor } = useSmartEditorActiveDocument();
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

    // Ekspedisjonsbrev til trygderetten will always have Trygderetten as only receiver
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

  const onFinish = async () => {
    try {
      if (
        mottakerList.length === 0 &&
        reachableSuggestedReceivers.length === 1 &&
        dokumentTypeId !== DistribusjonsType.EKSPEDISJONSBREV_TIL_TRYGDERETTEN
      ) {
        await setMottakerList({
          oppgaveId: data.id,
          dokumentId,
          mottakerList: reachableSuggestedReceivers,
        });
      }

      await finish({ dokumentId, oppgaveId: data.id }).unwrap();

      if (dokumentId === activeSmartEditor) {
        removeActiveSmartEditor();
      }
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
      disabled={disabled}
      {...rest}
    />
  );
};
