import { Fields } from '@app/components/documents/new-documents/grid';
import { AccessErrorsSummary } from '@app/components/documents/new-documents/modal/access-errors-summary';
import { AttachmentModalContent } from '@app/components/documents/new-documents/modal/modal-attachment-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { isNotNull } from '@app/functions/is-not-type-guards';
import type { IAttachmentDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
interface AttachmentProps extends Props {
  document: IAttachmentDocument;
  renameAccessError: string | null;
  removeAccessError: string | null;
}

export const AttachmentModal = ({
  document,
  isOpen,
  setIsOpen,
  renameAccessError,
  removeAccessError,
}: AttachmentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (renameAccessError !== null && removeAccessError !== null) {
    return (
      <AccessErrorsSummary documentErrors={[removeAccessError, renameAccessError]} placement="left">
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </AccessErrorsSummary>
    );
  }

  return (
    <>
      <AccessErrorsSummary documentErrors={[removeAccessError, renameAccessError].filter(isNotNull)} placement="left">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="document-actions-button"
          variant="tertiary-neutral"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
          style={{ gridArea: Fields.Action }}
        />
      </AccessErrorsSummary>
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
          <AttachmentModalContent
            document={document}
            renameAccess={renameAccessError}
            removeAccess={removeAccessError}
          />
        </Modal>
      ) : null}
    </>
  );
};
