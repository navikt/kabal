import { AccessErrorsSummary } from '@app/components/documents/new-documents/modal/access-errors-summary';
import { SetParentDocument } from '@app/components/documents/new-documents/modal/set-parent';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/set-filename';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
} from '@app/types/documents/documents';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { DeleteDocumentButton } from './delete-button';

interface AttachmentProps {
  document: IAttachmentDocument;
  renameAccess: string | null;
  removeAccess: string | null;
}

export const AttachmentModalContent = ({ document, renameAccess, removeAccess }: AttachmentProps) => {
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

          <AccessErrorsSummary documentErrors={renameAccess === null ? [] : [renameAccess]}>
            <HStack align="end" gap="2" wrap={false}>
              <SetFilename
                className="max-w-lg flex-grow"
                tittel={document.tittel}
                setFilename={(title) => setTitle({ oppgaveId, dokumentId: document.id, title })}
                disabled={renameAccess !== null}
              />
              <Button
                size="small"
                variant="secondary-neutral"
                icon={<CheckmarkIcon aria-hidden />}
                title="Endre dokumentnavn"
                data-testid="document-title-edit-save-button"
                disabled={renameAccess !== null}
              />
            </HStack>
          </AccessErrorsSummary>

          <AccessErrorsSummary documentErrors={removeAccess === null ? [] : [removeAccess]}>
            <SetParentDocument document={document} disabled={removeAccess !== null} />
          </AccessErrorsSummary>
        </VStack>
      </Modal.Body>

      <Modal.Footer className="items-center">
        <AccessErrorsSummary documentErrors={removeAccess === null ? [] : [removeAccess]}>
          <DeleteDocumentButton document={document} disabled={removeAccess !== null} />
        </AccessErrorsSummary>
      </Modal.Footer>
    </>
  );
};

const OpprettetTag = ({ document }: { document: IDocument }) => {
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
