import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { useContext } from 'react';
import { Confirm } from './confirm';
import { VALIDATION_ERROR_MESSAGES } from './error-messages';
import { type FinishProps, isSmartDocumentValidatonError } from './types';

export const ArchiveButtons = ({ document }: FinishProps) => {
  const { id: dokumentId } = document;
  const [finish, { isLoading }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const oppgaveId = useOppgaveId();
  const { close, setValidationErrors } = useContext(ModalContext);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const remove = useRemoveDocument();

  const onValidate = async () => {
    if (typeof oppgaveId !== 'string') {
      return false;
    }

    const validation = await validate({ dokumentId, oppgaveId }).unwrap();

    if (validation?.length > 0 && validation.some((v) => v.errors.length > 0)) {
      const validationErrors = validation.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors.map(({ type }) => ({ type, message: VALIDATION_ERROR_MESSAGES[type] })),
      }));

      setValidationErrors(validationErrors);

      return false;
    }

    setValidationErrors([]);

    return true;
  };

  const onFinish = async () => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    try {
      await finish({ dokumentId, oppgaveId }).unwrap();

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
      actionText="Arkiver"
      onValidate={onValidate}
      onFinish={onFinish}
      isFinishing={isLoading || document.isMarkertAvsluttet}
      isValidating={isValidating}
    />
  );
};
