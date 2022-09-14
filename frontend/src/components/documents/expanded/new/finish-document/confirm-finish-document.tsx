import { Applicant, Close, CoApplicant, FileFolder, People, Send } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React, { useContext } from 'react';
import styled, { css } from 'styled-components';
import { useOppgave } from '../../../../../hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '../../../../../hooks/oppgavebehandling/use-oppgave-id';
import { useFinishDocumentMutation } from '../../../../../redux-api/oppgaver/mutations/documents';
import { DocumentType, IMainDocument } from '../../../../../types/documents/documents';
import { Saksrolle } from '../../../../../types/oppgavebehandling/oppgavebehandling';
import { DocumentTypeEnum } from '../../../../show-document/types';
import { ShownDocumentContext } from '../../../context';

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
  const willSend = dokumentTypeId !== DocumentType.NOTAT;

  if (willSend) {
    return <SendView dokumentId={id} documentTitle={tittel} close={close} />;
  }

  return <ArchiveView dokumentId={id} documentTitle={tittel} close={close} />;
};

interface FinishProps {
  documentTitle: string;
  dokumentId: string;
  close: () => void;
}

const ArchiveView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation();
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
    finish({ dokumentId, oppgaveId });
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
          loading={isFinishing}
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
          disabled={isFinishing}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};

const SendView = ({ dokumentId, documentTitle, close }: FinishProps) => {
  const [finish, { isLoading: isFinishing }] = useFinishDocumentMutation();
  const { data, isLoading: oppgaveIsLoading } = useOppgave();
  const { shownDocument, setShownDocument } = useContext(ShownDocumentContext);

  if (oppgaveIsLoading || typeof data === 'undefined') {
    return null;
  }

  const onClick = () => {
    if (typeof data?.id !== 'string') {
      return;
    }

    if (
      shownDocument !== null &&
      shownDocument.type !== DocumentTypeEnum.ARCHIVED &&
      shownDocument.documentId === dokumentId
    ) {
      setShownDocument(null);
    }
    finish({ dokumentId, oppgaveId: data.id });
  };

  return (
    <StyledFinishDocument>
      <StyledHeader>{documentTitle}</StyledHeader>
      <StyledMainText>{`Send brevet "${documentTitle}" til`}</StyledMainText>
      <StyledBrevmottakerList>
        {data.brevmottakere.map(({ partId, navn, rolle }) => (
          <StyledBrevmottaker key={partId} title={getRolleName(rolle)}>
            {getIcon(rolle)} {navn}
          </StyledBrevmottaker>
        ))}
      </StyledBrevmottakerList>
      <StyledButtons>
        <Button
          type="button"
          size="small"
          variant="primary"
          onClick={onClick}
          loading={isFinishing}
          data-testid="document-finish-confirm"
          icon={<Send aria-hidden />}
        >
          Send ut
        </Button>
        <Button
          type="button"
          size="small"
          variant="secondary"
          onClick={close}
          data-testid="document-finish-cancel"
          disabled={isFinishing}
          icon={<Close aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledButtons>
    </StyledFinishDocument>
  );
};

const getIcon = (rolle: Saksrolle) => {
  switch (rolle) {
    case Saksrolle.KLAGER:
      return <StyledApplicant aria-hidden />;
    case Saksrolle.PROSESSFULLMEKTIG:
      return <StyledCoApplicant aria-hidden />;
    case Saksrolle.SAKEN_GJELDER:
      return <StyledPeople aria-hidden />;
    default:
      return null;
  }
};

const getRolleName = (rolle: Saksrolle): string => {
  switch (rolle) {
    case Saksrolle.KLAGER:
      return 'Klager';
    case Saksrolle.PROSESSFULLMEKTIG:
      return 'Prosessfullmektig';
    case Saksrolle.SAKEN_GJELDER:
      return 'Saken gjelder';
    default:
      return '';
  }
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

const StyledBrevmottakerList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: bold;
  margin: 0;
  margin-top: 8px;
  white-space: normal;
  list-style: none;
  padding-left: 0;
`;

const StyledBrevmottaker = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const iconStyle = css`
  & {
    width: 16px;
    flex-shrink: 0;
  }
`;

const StyledApplicant = styled(Applicant)`
  ${iconStyle}
`;
const StyledCoApplicant = styled(CoApplicant)`
  ${iconStyle}
`;
const StyledPeople = styled(People)`
  ${iconStyle}
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
