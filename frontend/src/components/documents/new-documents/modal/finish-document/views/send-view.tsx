import { Alert } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useMemo, useState } from 'react';
import { isSendError } from '@app/components/documents/new-documents/modal/finish-document/views/is-send-error';
import { Recipients } from '@app/components/documents/new-documents/modal/finish-document/views/recipients';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useBrevmottakere } from '@app/hooks/use-brevmottakere';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { Brevmottakertype } from '@app/types/kodeverk';
import { Confirm } from './confirm';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledFinishDocument } from './styled-components';
import { FinishProps } from './types';

export const SendView = ({ document }: FinishProps) => {
  const { id: dokumentId, tittel: documentTitle } = document;
  const [finish, { isLoading: isFinishing, error: finishError }] = useFinishDocumentMutation();
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const [brevmottakertypeIds, setBrevmottakertypeIds] = useState<Brevmottakertype[]>([]);
  const brevmottakere = useBrevmottakere();
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof data !== 'undefined' ? data.id : skipToken);
  const remove = useRemoveDocument();

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

    const types =
      brevmottakere.length === 1 && typeof brevmottakere[0] !== 'undefined'
        ? brevmottakere[0].brevmottakertyper
        : [...new Set(brevmottakertypeIds.flat())];

    if (types.length === 0) {
      setValidationErrors([{ dokumentId, title: documentTitle, errors: ['Minst én mottaker må velges'] }]);

      return;
    }

    setValidationErrors([]);

    try {
      await finish({ dokumentId, oppgaveId: data.id, brevmottakertypeIds: types }).unwrap();
      remove(dokumentId, document);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <StyledFinishDocument>
      <Recipients
        recipients={brevmottakere}
        selectedBrevmottakertypeIds={brevmottakertypeIds}
        setSelectedBrevmottakertypeIds={setBrevmottakertypeIds}
        label={`Send brevet "${documentTitle}" til`}
        sendErrors={sendErrors}
      />

      {sendErrors?.length === 0 ? null : (
        <Alert variant="error" size="small">
          Brevet er ikke sendt til noen. Se feil over.
        </Alert>
      )}

      <Confirm
        actionText="Send ut"
        onClick={onClick}
        isValidating={isValidating}
        isFinishing={isFinishing || document.isMarkertAvsluttet}
      />

      <Errors errors={validationErrors} />
    </StyledFinishDocument>
  );
};
