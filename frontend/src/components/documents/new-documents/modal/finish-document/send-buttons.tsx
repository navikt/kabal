import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { Confirm } from './confirm';
import { VALIDATION_ERROR_MESSAGES } from './error-messages';
import { type FinishProps, isSmartDocumentValidatonError } from './types';

export const SendButtons = ({ document, disabled, ...rest }: FinishProps) => {
  const { id: dokumentId } = document;
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();
  const { close, setValidationErrors } = useContext(ModalContext);

  if (oppgaveIsLoading || data === undefined) {
    return null;
  }

  const onValidate = async () => {
    if (typeof data?.id !== 'string') {
      return false;
    }

    setValidationErrors([]);

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
      disabled={disabled}
      {...rest}
    />
  );
};
