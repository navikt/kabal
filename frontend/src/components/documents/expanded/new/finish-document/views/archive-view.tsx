import { Close, FileFolder } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { useContext, useState } from 'react';
import { useOppgaveId } from '../../../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFinishDocumentMutation } from '../../../../../../redux-api/oppgaver/mutations/documents';
import {
  useGetDocumentsQuery,
  useLazyValidateDocumentQuery,
} from '../../../../../../redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '../../../../../show-document/types';
import { ShownDocumentContext } from '../../../../context';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledButtons, StyledFinishDocument, StyledHeader, StyledMainText } from './styled-components';
import { FinishProps } from './types';

export const ArchiveView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading }] = useFinishDocumentMutation();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [validate, { isFetching: isValidating }] = useLazyValidateDocumentQuery();
  const { data: documents = [] } = useGetDocumentsQuery(typeof oppgaveId === 'string' ? { oppgaveId } : skipToken);

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

    if (
      shownDocument !== null &&
      shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
      shownDocument.documentId === dokumentId
    ) {
      setShownDocument(null);
    }

    setErrors([]);
    finish({ dokumentId, oppgaveId, brevmottakertypeIds: null });
  };

  return (
    <StyledFinishDocument>
      <StyledHeader>Arkiver dokument</StyledHeader>
      <StyledMainText>{`Arkiver notatet "${documentTitle}".`}</StyledMainText>

      <Errors errors={errors} />

      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={onClick}
          loading={isLoading || isValidating}
          data-testid="document-finish-confirm"
          icon={<FileFolder aria-hidden />}
        >
          Arkiver
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={close}
          data-testid="document-finish-cancel"
          disabled={isLoading || isValidating}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};
