import { Close, FileFolder } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { useOppgaveId } from '../../../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFinishDocumentMutation } from '../../../../../../redux-api/oppgaver/mutations/documents';
import { DocumentTypeEnum } from '../../../../../show-document/types';
import { ShownDocumentContext } from '../../../../context';
import { StyledButtons, StyledFinishDocument, StyledHeader, StyledMainText } from './styled-components';
import { FinishProps } from './types';

export const ArchiveView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading }] = useFinishDocumentMutation();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);
  const oppgaveId = useOppgaveId();

  const onClick = () => {
    if (typeof oppgaveId !== 'string') {
      return;
    }

    if (
      shownDocument !== null &&
      shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
      shownDocument.documentId === dokumentId
    ) {
      setShownDocument(null);
    }

    finish({ dokumentId, oppgaveId, brevmottakertypeIds: null });
  };

  return (
    <StyledFinishDocument>
      <StyledHeader>Arkiver dokument</StyledHeader>
      <StyledMainText>{`Arkiver notatet "${documentTitle}".`}</StyledMainText>
      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={onClick}
          loading={isLoading}
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
          disabled={isLoading}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};
