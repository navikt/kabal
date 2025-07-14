import { Fields } from '@app/components/documents/new-documents/grid';
import { AttachmentModalContent } from '@app/components/documents/new-documents/modal/modal-attachment-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { isNotNull } from '@app/functions/is-not-type-guards';
import type { IAttachmentDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, Modal, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
interface AttachmentProps extends Props {
  document: IAttachmentDocument;
  renameAccess: string | null;
  removeAccess: string | null;
}

export const AttachmentModal = ({ document, isOpen, setIsOpen, renameAccess, removeAccess }: AttachmentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (renameAccess !== null && removeAccess !== null) {
    return (
      <AttachmentSummary removeAccess={removeAccess} renameAccess={renameAccess}>
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </AttachmentSummary>
    );
  }

  return (
    <>
      <AttachmentSummary removeAccess={removeAccess} renameAccess={renameAccess}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="document-actions-button"
          variant="tertiary-neutral"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
          style={{ gridArea: Fields.Action }}
        />
      </AttachmentSummary>
      {isOpen ? (
        <Modal
          open
          width="600px"
          aria-modal
          data-testid="document-actions-modal"
          header={{
            heading: `Valg for «${tittel}»`,
            icon: <DocumentIcon type={type} />,
          }}
          closeOnBackdropClick
          onClose={() => {
            close();
            setIsOpen(false);
          }}
        >
          <AttachmentModalContent document={document} renameAccess={renameAccess} removeAccess={removeAccess} />
        </Modal>
      ) : null}
    </>
  );
};

interface AttachmentSummaryProps {
  renameAccess: string | null;
  removeAccess: string | null;
  children: React.ReactElement;
}

const AttachmentSummary = ({ renameAccess, removeAccess, children }: AttachmentSummaryProps) => {
  const summary = toSummary(renameAccess, removeAccess);

  if (summary === null) {
    return children;
  }

  return (
    <Tooltip content={summary} maxChar={Number.POSITIVE_INFINITY} className="whitespace-pre text-left">
      {children}
    </Tooltip>
  );
};

const toSummary = (...points: (string | null)[]) => {
  const filtered = points.filter(isNotNull);

  return filtered.length === 0 ? null : filtered.join('\n- ');
};
