import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '../../../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../../../hooks/oppgavebehandling/use-oppgave-id';
import { getSakenGjelderName } from '../../../../../hooks/use-klager-name';
import { useFinishDocumentMutation } from '../../../../../redux-api/documents';
import { DocumentType, IMainDocument } from '../../../../../types/documents';
import { ISakenGjelder } from '../../../../../types/oppgavebehandling';

interface Props {
  document: IMainDocument;
  close: () => void;
  isOpen: boolean;
}

export const ConfirmFinishDocument = ({ isOpen, close, document }: Props) => {
  const { data, isLoading } = useOppgave();

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

  if (isLoading || typeof data === 'undefined') {
    return null;
  }

  return (
    <FinishView
      dokumentId={id}
      title="Send dokument"
      mainText={`Send brevet ${tittel} til`}
      confirmText="Send ut"
      close={close}
      sakenGjelder={data.sakenGjelder}
    />
  );
};

interface FinishProps {
  title: string;
  mainText: string;
  sakenGjelder?: ISakenGjelder;
  confirmText: string;
  dokumentId: string;
  close: () => void;
}

const FinishView = ({ title, mainText, confirmText, sakenGjelder, dokumentId, close }: FinishProps) => {
  const [finish] = useFinishDocumentMutation();
  const oppgaveId = useOppgaveId();
  const sakenGjelderText =
    typeof sakenGjelder === 'undefined' ? null : (
      <StyledSakenGjelder>{getSakenGjelderName(sakenGjelder)}</StyledSakenGjelder>
    );

  return (
    <StyledFinishDocument>
      <StyledHeader>{title}</StyledHeader>
      <StyledMainText>{mainText}</StyledMainText>
      {sakenGjelderText}
      <StyledButtons>
        <Hovedknapp mini onClick={() => finish({ dokumentId, oppgaveId })}>
          {confirmText}
        </Hovedknapp>
        <Knapp mini onClick={close}>
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