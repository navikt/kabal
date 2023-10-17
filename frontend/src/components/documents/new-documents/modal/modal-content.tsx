import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Modal, Tag } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { getIsRolQuestions } from '@app/components/documents/new-documents/helpers';
import { ArchiveButtons } from '@app/components/documents/new-documents/modal/finish-document/archive-buttons';
import { Errors } from '@app/components/documents/new-documents/modal/finish-document/errors';
import { Receipients } from '@app/components/documents/new-documents/modal/finish-document/recipients';
import { SendButtons } from '@app/components/documents/new-documents/modal/finish-document/send-buttons';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { SetDocumentType } from '@app/components/documents/new-documents/modal/set-type/set-document-type';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/new-documents/shared/set-filename';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useCanDeleteDocument, useCanEditDocument } from '@app/hooks/use-can-edit-document';
import { useContainsRolAttachments } from '@app/hooks/use-contains-rol-attachments';
import { useIsSaksbehandler } from '@app/hooks/use-is-saksbehandler';
import {
  DOCUMENT_TYPE_NAMES,
  DistribusjonsType,
  DocumentTypeEnum,
  IMainDocument,
} from '@app/types/documents/documents';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FlowState } from '@app/types/oppgave-common';
import { IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { DeleteDocumentButton } from './delete-button';
import { SetParentDocument } from './set-parent';
import { OPTIONS_MAP } from './set-type/options';

interface Props {
  document: IMainDocument;
}

export const DocumentModalContent = ({ document }: Props) => {
  const { validationErrors } = useContext(ModalContext);

  const canEditDocument = useCanEditDocument(document);
  const canDelete = useCanDeleteDocument(document);
  const isSaksbehandler = useIsSaksbehandler();

  const icon = <DocumentIcon type={document.type} />;

  const isNotat = document.dokumentTypeId === DistribusjonsType.NOTAT;
  const isMainDocument = document.parentId === null;
  const isRolQuestions = getIsRolQuestions(document);

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
          <OpprettetTag document={document} />
        </Row>

        {canEditDocument && document.type !== DocumentTypeEnum.JOURNALFOERT ? (
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

        {canEditDocument && isMainDocument && !isRolQuestions ? <SetDocumentType document={document} /> : null}

        {canEditDocument && !isRolQuestions ? <SetParentDocument document={document} /> : null}

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

const OpprettetTag = ({ document }: { document: IMainDocument }) => {
  if (document.type !== DocumentTypeEnum.JOURNALFOERT) {
    return null;
  }

  return (
    <Tag variant="alt3" size="small" title="Opprettet">
      <CalendarIcon aria-hidden />
      &nbsp;
      <DocumentDate document={document} />
    </Tag>
  );
};

interface IFinishButtonProps {
  document: IMainDocument;
}

const FinishButton = ({ document }: IFinishButtonProps) => {
  const { data: oppgave } = useOppgave();
  const isSaksbehandler = useIsSaksbehandler();
  const containsRolAttachments = useContainsRolAttachments(document);

  if (!isSaksbehandler || document.parentId !== null || oppgave === undefined) {
    return null;
  }

  if (getMustWaitForRolToReturn(oppgave, document, containsRolAttachments)) {
    return (
      <Alert variant="info" size="small" inline>
        Kan ikke arkiveres før rådgivende overlege har svart og returnert saken.
      </Alert>
    );
  }

  const isNotat = document.dokumentTypeId !== DistribusjonsType.NOTAT;

  return isNotat ? <SendButtons document={document} /> : <ArchiveButtons document={document} />;
};

const getMustWaitForRolToReturn = (
  oppgave: IOppgavebehandling,
  document: IMainDocument,
  containsRolAttachments: boolean,
) => {
  const isOppgaveTypeRelevantToRol = oppgave.typeId === SaksTypeEnum.KLAGE || oppgave.typeId === SaksTypeEnum.ANKE;

  if (!isOppgaveTypeRelevantToRol) {
    return false;
  }

  if (getIsRolQuestions(document)) {
    return !(containsRolAttachments && oppgave.rol.flowState === FlowState.RETURNED);
  }

  return false;
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
