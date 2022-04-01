import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useOppgaveId } from '../../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useSakspartName } from '../../../../../hooks/use-klager-name';
import { useFinishDocumentMutation } from '../../../../../redux-api/documents';
import { DocumentType, IMainDocument } from '../../../../../types/documents';

interface Props {
  document: IMainDocument;
  close: () => void;
  isOpen: boolean;
}

export const ConfirmFinishDocument = ({ isOpen, close, document }: Props) => {
  if (!isOpen) {
    return null;
  }

  const { tittel, id, dokumentTypeId } = document;
  const shouldArchive = dokumentTypeId === DocumentType.NOTAT;

  if (shouldArchive) {
    return (
      <FinishView
        title="Arkiver dokument"
        mainText={`Arkiver notatet ${tittel}`}
        confirmText="Arkiver"
        dokumentId={id}
        close={close}
      />
    );
  }

  return (
    <FinishView
      dokumentId={id}
      title="Send dokument"
      mainText={`Send brevet ${tittel} til`}
      confirmText="Send ut"
      close={close}
    />
  );
};

interface FinishProps {
  title: string;
  mainText: string;
  confirmText: string;
  dokumentId: string;
  close: () => void;
}

const FinishView = ({ title, mainText, confirmText, dokumentId, close }: FinishProps) => {
  const [finish, { isLoading }] = useFinishDocumentMutation();
  const oppgaveId = useOppgaveId();
  const sakspart = useSakspartName('sakenGjelder');
  const sakenGjelderText = typeof sakspart === 'undefined' ? null : <StyledSakenGjelder>{sakspart}</StyledSakenGjelder>;

  return (
    <StyledFinishDocument>
      <StyledHeader>{title}</StyledHeader>
      <StyledMainText>{mainText}</StyledMainText>
      {sakenGjelderText}
      <StyledButtons>
        <Hovedknapp
          mini
          onClick={() => finish({ dokumentId, oppgaveId })}
          spinner={isLoading}
          autoDisableVedSpinner
          data-testid="document-finish-confirm"
        >
          {confirmText}
        </Hovedknapp>
        <Knapp mini onClick={close} data-testid="document-finish-cancel" disabled={isLoading}>
          Avbryt
        </Knapp>
      </StyledButtons>
    </StyledFinishDocument>
  );
};

const StyledFinishDocument = styled.section`
  position: absolute;
  right: 0;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background: white;
  padding: 16px;
  max-width: 500px;
  min-width: 300px;
  z-index: 5;
`;

const StyledButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
`;

const StyledSakenGjelder = styled.p`
  font-weight: bold;
  margin: 0;
  margin-top: 8px;
  white-space: normal;
`;

const StyledHeader = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  margin-bottom: 8px;
`;

const StyledMainText = styled.p`
  margin: 0;
  white-space: normal;
`;
