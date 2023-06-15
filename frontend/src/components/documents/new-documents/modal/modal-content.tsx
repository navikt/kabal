import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Loader, Tag } from '@navikt/ds-react';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { SetDocumentType } from '@app/components/documents/new-documents/modal/set-type/set-document-type';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/new-documents/shared/set-filename';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum, IMainDocument } from '@app/types/documents/documents';
import { DeleteDocumentButton } from './delete-button';
import { FinishDocument } from './finish-document/finish-document';
import { SetParentDocument } from './set-parent';

interface Props {
  document: IMainDocument;
  titleId: string;
}

export const DocumentModalContent = ({ document, titleId }: Props) => {
  const oppgaveId = useOppgaveId();
  const { data, isLoading } = useGetDocumentsQuery(oppgaveId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, []);

  if (isLoading || typeof data === 'undefined') {
    return (
      <Container>
        <Loader size="xlarge" />
      </Container>
    );
  }

  const icon = <DocumentIcon type={document.type} />;

  return (
    <Container data-testid="document-actions-container" ref={ref}>
      <StyledHeading level="1" size="medium" id={titleId}>
        {icon}
        Valg for &quot;{document.tittel}&quot;
      </StyledHeading>
      <Row>
        <Tag variant="info" size="small" title="Dokumenttype">
          {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
        </Tag>
        <Tag variant="alt3" size="small" title="Opprettet">
          <CalendarIcon aria-hidden />
          &nbsp;
          <DocumentDate document={document} />
        </Tag>
      </Row>
      <BottomAlignedRow>
        <StyledSetFilename document={document} />
        <Button
          size="small"
          variant="secondary"
          icon={<CheckmarkIcon aria-hidden />}
          title="Endre dokumentnavn"
          data-testid="document-title-edit-save-button"
        />
      </BottomAlignedRow>
      {document.type === DocumentTypeEnum.JOURNALFOERT ? (
        <Alert variant="warning" size="small" inline>
          Merk at du endrer navn på det originale journalførte dokumentet.
        </Alert>
      ) : null}
      <SetDocumentType document={document} />
      <SetParentDocument document={document} />
      <FinishDocument document={document} />
      <DeleteDocumentButton document={document} />
    </Container>
  );
};

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

const BottomAlignedRow = styled(Row)`
  align-items: flex-end;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 640px;
`;

const StyledHeading = styled(Heading)`
  display: flex;
  flex-direction: row;
  column-gap: 8px;
  align-items: center;
  white-space: nowrap;
  margin-right: 64px;
`;

const StyledSetFilename = styled(SetFilename)`
  flex-grow: 1;
  max-width: 512px;
`;
