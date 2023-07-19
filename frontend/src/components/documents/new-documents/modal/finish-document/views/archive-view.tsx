import { Heading } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledFinishDocument } from './styled-components';
import { FinishProps } from './types';

export const ArchiveView = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const [finish, { isLoading }] = useFinishDocumentMutation();
  const oppgaveId = useOppgaveId();
  const [errors, setErrors] = useState<ValidationError[]>([]);
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

      setErrors(validationErrors);

      return;
    }

    setErrors([]);
    await finish({ dokumentId, oppgaveId });
    remove(dokumentId, document);
  };

  return (
    <StyledFinishDocument>
      <Heading size="xsmall" level="1">{`Arkiver notatet "${documentTitle}".`}</Heading>

      <Errors errors={errors} />

      <Confirm
        actionText="Arkiver"
        onClick={onClick}
        isFinishing={isLoading || document.isMarkertAvsluttet}
        isValidating={isValidating}
      />
    </StyledFinishDocument>
  );
};
