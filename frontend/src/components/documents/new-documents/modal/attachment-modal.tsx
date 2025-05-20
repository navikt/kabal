import { Fields } from '@app/components/documents/new-documents/grid';
import { AttachmentModalContent } from '@app/components/documents/new-documents/modal/modal-attachment-content';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { AttachmentAccessEnum } from '@app/hooks/dua-access/attachment-access';
import { getAttachmentAccessSummary } from '@app/hooks/dua-access/summary/get-attachment-access-summary';
import type { AttachmentAccess } from '@app/hooks/dua-access/use-attachment-access';
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
  access: AttachmentAccess;
}

export const AttachmentModal = ({ document, isOpen, setIsOpen, access }: AttachmentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (
    access.rename !== AttachmentAccessEnum.ALLOWED &&
    access.move !== AttachmentAccessEnum.ALLOWED &&
    access.remove !== AttachmentAccessEnum.ALLOWED
  ) {
    return (
      <AttachmentSummary access={access}>
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </AttachmentSummary>
    );
  }

  return (
    <>
      <AttachmentSummary access={access}>
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
          <AttachmentModalContent document={document} access={access} />
        </Modal>
      ) : null}
    </>
  );
};

interface AttachmentSummaryProps {
  access: AttachmentAccess;
  children: React.ReactElement;
}

const AttachmentSummary = ({ access, children }: AttachmentSummaryProps) => {
  const summary = getAttachmentAccessSummary(access);

  if (summary === null) {
    return children;
  }

  return (
    <Tooltip content={summary} maxChar={Number.POSITIVE_INFINITY} className="whitespace-pre text-left">
      {children}
    </Tooltip>
  );
};
