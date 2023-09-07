import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, Tag } from '@navikt/ds-react';
import React, { useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { Errors } from '@app/components/documents/new-documents/modal/finish-document/errors';
import { Receipients } from '@app/components/documents/new-documents/modal/finish-document/recipients';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { SetDocumentType } from '@app/components/documents/new-documents/modal/set-type/set-document-type';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/new-documents/shared/set-filename';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useCanDeleteDocument, useCanEditDocument } from '@app/hooks/use-can-edit-document';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import { useGetDocumentsQuery } from '@app/redux-api/oppgaver/queries/documents';
import {
  DOCUMENT_TYPE_NAMES,
  DistribusjonsType,
  DocumentTypeEnum,
  IMainDocument,
} from '@app/types/documents/documents';
import { DeleteDocumentButton } from './delete-button';
import { SetParentDocument } from './set-parent';
import { OPTIONS_MAP } from './set-type/options';

interface Props {
  document: IMainDocument;
}

export const DocumentModalContent = ({ document }: Props) => {
  const { validationErrors } = useContext(ModalContext);

  const oppgaveId = useOppgaveId();
  const { data: documents } = useGetDocumentsQuery(oppgaveId);
  const parentDocument = useMemo(
    () => documents?.find((d) => d.id === document.parentId),
    [documents, document.parentId],
  );
  const canEditDocument = useCanEditDocument(document, parentDocument);
  const canDelete = useCanDeleteDocument(document);
  const isSaksbehandler = useIsSaksbehandler();

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;
  const isMainDocument = document.parentId === null;

  return (
    <>
      <ModalBody>
        <Row>
          <Tag variant="info" size="small">
            {isMainDocument ? OPTIONS_MAP[document.dokumentTypeId] : 'Vedlegg'}
          </Tag>
          <Tag variant="info" size="small" title="Dokumenttype">
            {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
          </Tag>
          <Tag variant="alt3" size="small" title="Opprettet">
            <CalendarIcon aria-hidden />
            &nbsp;
            <DocumentDate document={document} />
          </Tag>
        </Row>

        {canEditDocument ? (
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
        ) : null}

        {canEditDocument && document.type === DocumentTypeEnum.JOURNALFOERT ? (
          <Alert variant="warning" size="small" inline>
            Merk at du endrer navn på det originale journalførte dokumentet.
          </Alert>
        ) : null}

        {canEditDocument && isMainDocument ? <SetDocumentType document={document} /> : null}

        {canEditDocument ? <SetParentDocument document={document} /> : null}

        {isSaksbehandler && !isNotat && isMainDocument ? <Receipients document={document} /> : null}

        <Errors errors={validationErrors} />
      </ModalBody>

      <Modal.Footer>
        {canDelete ? <DeleteDocumentButton document={document} /> : null}
        <FinishButton document={document} />
      </Modal.Footer>
    </>
  );
};

interface IFinishButtonProps {
  document: IMainDocument;
}

const FinishButton = ({ document }: IFinishButtonProps) => {
  const isSaksbehandler = useIsSaksbehandler();

  if (!isSaksbehandler || document.parentId !== null) {
    return null;
  }

  return document.dokumentTypeId !== DistribusjonsType.NOTAT ? (
    <SendButtons document={document} />
  ) : (
    <ArchiveButtons document={document} />
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

const ModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const StyledSetFilename = styled(SetFilename)`
  flex-grow: 1;
  max-width: 512px;
`;
