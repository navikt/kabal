import { SetParentDocument } from '@app/components/documents/new-documents/modal/set-parent';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/set-filename';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/oppgaver/mutations/documents';
import { DOCUMENT_TYPE_NAMES, DocumentTypeEnum, type IMainDocument } from '@app/types/documents/documents';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { DeleteDocumentButton } from './delete-button';

interface AttachmentProps {
  document: IMainDocument;
  access: AttachmentAccess;
}

export const AttachmentModalContent = ({ document, access }: AttachmentProps) => {
  const [setTitle] = useSetTitleMutation();
  const oppgaveId = useOppgaveId();

  if (oppgaveId === skipToken) {
    return null;
  }

  const icon = <DocumentIcon type={document.type} />;

  return (
    <>
      <Modal.Body className={`flex w-full gap-4 overflow-hidden ${'h-auto'}`}>
        <VStack gap="4" minWidth="400px" flexShrink="0">
          <HStack align="center" gap="2">
            <Tag variant="info" size="small">
              Vedlegg
            </Tag>
            <Tag variant="info" size="small" title="Dokumenttype">
              {icon}&nbsp;{DOCUMENT_TYPE_NAMES[document.type]}
            </Tag>
            <OpprettetTag document={document} />
          </HStack>

          {access.rename && document.type !== DocumentTypeEnum.JOURNALFOERT ? (
            <HStack align="end" gap="2" wrap={false}>
              <SetFilename
                className="max-w-lg flex-grow"
                tittel={document.tittel}
                setFilename={(title) => setTitle({ oppgaveId, dokumentId: document.id, title })}
              />
              <Button
                size="small"
                variant="secondary"
                icon={<CheckmarkIcon aria-hidden />}
                title="Endre dokumentnavn"
                data-testid="document-title-edit-save-button"
              />
            </HStack>
          ) : null}

          {access.move ? <SetParentDocument document={document} /> : null}
        </VStack>
      </Modal.Body>

      <Modal.Footer>{access.remove ? <DeleteDocumentButton document={document} /> : null}</Modal.Footer>
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
