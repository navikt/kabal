import { MenuElipsisVerticalIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, Dialog } from '@navikt/ds-react';
import { useContext } from 'react';
import { Fields } from '@/components/documents/new-documents/grid';
import { AccessErrorsSummary } from '@/components/documents/new-documents/modal/access-errors-summary';
import { AttachmentModalContent } from '@/components/documents/new-documents/modal/modal-attachment-content';
import { ModalContext } from '@/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@/components/documents/new-documents/shared/document-icon';
import { isNotNull } from '@/functions/is-not-type-guards';
import type { IAttachmentDocument } from '@/types/documents/documents';

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
          data-color="neutral"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Åpne flere valg for dokument"
          variant="tertiary"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
          style={{ gridArea: Fields.Action }}
        />
      </AccessErrorsSummary>
      <Dialog
        open={isOpen}
        onOpenChange={(next) => {
          if (!next) {
            close();
            setIsOpen(false);
          }
        }}
      >
        <Dialog.Popup width="600px">
          <Dialog.Header>
            <Dialog.Title className="flex items-center gap-2">
              <DocumentIcon type={type} />
              Valg for «{tittel}»
            </Dialog.Title>
          </Dialog.Header>
          <AttachmentModalContent
            document={document}
            renameAccess={renameAccessError}
            removeAccess={removeAccessError}
          />
        </Dialog.Popup>
      </Dialog>
    </>
  );
};
