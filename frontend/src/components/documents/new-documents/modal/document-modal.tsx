import { Fields } from '@app/components/documents/new-documents/grid';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-document-content';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { DocumentAccessEnum } from '@app/hooks/dua-access/document-access';
import { getDocumentAccessSummary } from '@app/hooks/dua-access/summary/get-document-access-summary';
import type { DocumentAccess } from '@app/hooks/dua-access/use-document-access';
import type { IParentDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, Modal, Tooltip } from '@navikt/ds-react';
import { useContext } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface DocumentProps extends Props {
  document: IParentDocument;
  access: DocumentAccess;
}

export const DocumentModal = ({ document, isOpen, setIsOpen, access }: DocumentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);

  if (
    access.rename !== DocumentAccessEnum.ALLOWED &&
    access.remove !== DocumentAccessEnum.ALLOWED &&
    access.changeType !== DocumentAccessEnum.ALLOWED &&
    access.finish !== DocumentAccessEnum.ALLOWED
  ) {
    return (
      <DocumentSummary access={access}>
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </DocumentSummary>
    );
  }

  return (
    <>
      <DocumentSummary access={access}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          data-testid="document-actions-button"
          variant="tertiary-neutral"
          size="small"
          icon={<MenuElipsisVerticalIcon aria-hidden />}
          style={{ gridArea: Fields.Action }}
        />
      </DocumentSummary>
      {isOpen ? (
        <Modal
          open
          width={document.parentId === null ? '2000px' : '600px'}
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
          <DocumentModalContent document={document} access={access} />
        </Modal>
      ) : null}
    </>
  );
};

interface DocumentSummaryProps {
  access: DocumentAccess;
  children: React.ReactElement;
}

const DocumentSummary = ({ access, children }: DocumentSummaryProps) => {
  const summary = getDocumentAccessSummary(access);

  if (summary === null) {
    return children;
  }

  return (
    <Tooltip content={summary} maxChar={Number.POSITIVE_INFINITY} className="whitespace-pre text-left">
      {children}
    </Tooltip>
  );
};
