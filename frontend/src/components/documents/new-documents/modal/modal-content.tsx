import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Heading, Modal, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
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
import {
  DOCUMENT_TYPE_NAMES,
  DistribusjonsType,
  DocumentTypeEnum,
  IMainDocument,
} from '@app/types/documents/documents';
import { DeleteDocumentButton } from './delete-button';
import { SetParentDocument } from './set-parent';

interface Props {
  document: IMainDocument;
  titleId: string;
}

export const DocumentModalContent = ({ document, titleId }: Props) => {
  const { validationErrors } = useContext(ModalContext);

  const icon = <DocumentIcon type={document.type} />;

  return (
    <>
      <Modal.Header>
        <StyledHeading level="1" size="medium" id={titleId}>
          {icon}
          Valg for &quot;{document.tittel}&quot;
        </StyledHeading>
      </Modal.Header>

      <ModalBody>
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
        {document.isMarkertAvsluttet ? null : (
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
        )}
        {document.type === DocumentTypeEnum.JOURNALFOERT && !document.isMarkertAvsluttet ? (
          <Alert variant="warning" size="small" inline>
            Merk at du endrer navn på det originale journalførte dokumentet.
          </Alert>
        ) : null}
        <SetDocumentType document={document} />
        <SetParentDocument document={document} />

        {document.dokumentTypeId !== DistribusjonsType.NOTAT ? <Receipients document={document} /> : null}
        <Errors errors={validationErrors} />
      </ModalBody>

      <Modal.Footer>
        <DeleteDocumentButton document={document} />
        <Buttons document={document} />
      </Modal.Footer>
    </>
  );
};

interface IButtonsProps {
  document: IMainDocument;
}

const Buttons = ({ document }: IButtonsProps) => {
  if (document.parentId !== null) {
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
