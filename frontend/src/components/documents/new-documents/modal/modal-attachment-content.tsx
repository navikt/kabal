import { SetParentDocument } from '@app/components/documents/new-documents/modal/set-parent';
import { DocumentDate } from '@app/components/documents/new-documents/shared/document-date';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { SetFilename } from '@app/components/documents/set-filename';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import {
  type AttachmentAccessEnumMap,
  MOVE_ACCESS_ENUM_TO_TEXT,
  REMOVE_ACCESS_ENUM_TO_TEXT,
  RENAME_ACCESS_ENUM_TO_TEXT,
} from '@app/hooks/dua-access/attachment-messages';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useSetTitleMutation } from '@app/redux-api/oppgaver/mutations/documents';
import {
  DOCUMENT_TYPE_NAMES,
  DocumentTypeEnum,
  type IAttachmentDocument,
  type IDocument,
} from '@app/types/documents/documents';
import { CalendarIcon, CheckmarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack, Modal, Tag, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { DeleteDocumentButton } from './delete-button';

interface AttachmentProps {
  document: IAttachmentDocument;
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

          {access.rename === AttachmentAccessEnum.ALLOWED ? (
            <HStack align="end" gap="2" wrap={false}>
              <SetFilename
                className="max-w-lg flex-grow"
                tittel={document.tittel}
                setFilename={(title) => setTitle({ oppgaveId, dokumentId: document.id, title })}
              />
              <Button
                size="small"
                variant="secondary-neutral"
                icon={<CheckmarkIcon aria-hidden />}
                title="Endre dokumentnavn"
                data-testid="document-title-edit-save-button"
              />
            </HStack>
          ) : (
            <AccessAlert access={access.rename} TEXT={RENAME_ACCESS_ENUM_TO_TEXT} />
          )}

          {access.move === AttachmentAccessEnum.ALLOWED ? (
            <SetParentDocument document={document} />
          ) : (
            <AccessAlert access={access.move} TEXT={MOVE_ACCESS_ENUM_TO_TEXT} />
          )}
        </VStack>
      </Modal.Body>

      <Modal.Footer className="items-center">
        {access.remove === AttachmentAccessEnum.ALLOWED ? (
          <DeleteDocumentButton document={document} />
        ) : (
          <AccessAlert access={access.remove} TEXT={REMOVE_ACCESS_ENUM_TO_TEXT} />
        )}
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

interface AccessAlertProps {
  access: AttachmentAccessEnum;
  TEXT: AttachmentAccessEnumMap;
}

const AccessAlert = ({ access, TEXT }: AccessAlertProps) => {
  const text = TEXT[access];

  if (text === null) {
    return null;
  }

  return (
    <Alert variant="info" size="small" inline>
      {text}
    </Alert>
  );
};
