import { Fields } from '@app/components/documents/new-documents/grid';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-document-content';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { useDOcumentAccessList } from '@app/hooks/dua-access/use-document-access';
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
}

const ACCESS_LIST = [DuaActionEnum.RENAME, DuaActionEnum.CHANGE_TYPE, DuaActionEnum.REMOVE, DuaActionEnum.FINISH];

export const DocumentModal = ({ document, isOpen, setIsOpen }: DocumentProps) => {
  const { tittel, type, id, isMarkertAvsluttet, isSmartDokument, creator, templateId } = document;
  const { close } = useContext(ModalContext);
  const accessList = useDOcumentAccessList(
    { creatorRole: creator.creatorRole, isMarkertAvsluttet, id, isSmartDokument, type, templateId },
    ...ACCESS_LIST,
  );

  if (accessList.length === ACCESS_LIST.length) {
    return (
      <DocumentSummary accessList={accessList}>
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </DocumentSummary>
    );
  }

  return (
    <>
      <DocumentSummary accessList={accessList}>
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
          <DocumentModalContent document={document} />
        </Modal>
      ) : null}
    </>
  );
};

interface DocumentSummaryProps {
  accessList: string[];
  children: React.ReactElement;
}

const DocumentSummary = ({ accessList, children }: DocumentSummaryProps) => {
  if (accessList.length === 0) {
    return children;
  }

  return (
    <Tooltip
      content={`- ${accessList.join('\n- ')}`}
      maxChar={Number.POSITIVE_INFINITY}
      className="whitespace-pre text-left"
    >
      {children}
    </Tooltip>
  );
};
