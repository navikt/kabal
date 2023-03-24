import { FolderFileIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useState } from 'react';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useRemoveDocument } from '@app/hooks/use-remove-document';
import { useFinishDocumentMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { useGetDocumentsQuery, useLazyValidateDocumentQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DocumentTypeEnum } from '../../../../../show-document/types';
import { ERROR_MESSAGES } from './error-messages';
import { Errors, ValidationError } from './errors';
import { StyledButtons, StyledFinishDocument, StyledHeader, StyledMainText } from './styled-components';
import { FinishProps } from './types';

export const ArchiveView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading }] = useFinishDocumentMutation();
  const { value: shownDocument, remove: removeShownDocument } = useDocumentsPdfViewed();
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

    if (
      shownDocument !== undefined &&
      shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
      shownDocument.documentId === dokumentId
    ) {
      removeShownDocument();
    }

    setErrors([]);
    await finish({ dokumentId, oppgaveId, brevmottakertypeIds: null });
    remove(dokumentId);
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
          icon={<FolderFileIcon aria-hidden />}
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
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};
