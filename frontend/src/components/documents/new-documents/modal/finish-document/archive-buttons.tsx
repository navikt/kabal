import React, { useContext } from 'react';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { FinishProps } from './types';

export const ArchiveButtons = ({ document }: FinishProps) => {
  const { id: dokumentId } = document;
  const [finish, { isLoading }] = useFinishDocumentMutation({ fixedCacheKey: document.id });
  const oppgaveId = useOppgaveId();
  const { setValidationErrors } = useContext(ModalContext);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(oppgaveId);
  const remove = useRemoveDocument();

  const onClick = async () => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    const validation = await validate({ dokumentId, oppgaveId }).unwrap();

    if (validation?.length !== 0 && validation.some((v) => v.errors.length !== 0)) {
      const validationErrors = validation.map((v) => ({
        dokumentId: v.dokumentId,
        title: documents.find((d) => d.id === v.dokumentId)?.tittel ?? v.dokumentId,
        errors: v.errors.map((e) => ERROR_MESSAGES[e.type]),
      }));

      setValidationErrors(validationErrors);

      return;
    }

    setValidationErrors([]);
    await finish({ dokumentId, oppgaveId });
    remove(dokumentId, document);
  };

  return (
    <Confirm
      actionText="Arkiver"
      onClick={onClick}
      isFinishing={isLoading || document.isMarkertAvsluttet}
      isValidating={isValidating}
    />
  );
};
