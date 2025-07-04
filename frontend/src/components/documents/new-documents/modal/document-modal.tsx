import { Fields } from '@app/components/documents/new-documents/grid';
import { useFinishValidationErrors } from '@app/components/documents/new-documents/hooks/use-finish-access';
import { useRemoveDocumentAccessError as useRemoveDocumentAccessErrors } from '@app/components/documents/new-documents/hooks/use-remove-access';
import { AccessErrorsSummary } from '@app/components/documents/new-documents/modal/access-errors-summary';
import { ModalContext } from '@app/components/documents/new-documents/modal/modal-context';
import { DocumentModalContent } from '@app/components/documents/new-documents/modal/modal-document-content';
import { DocumentIcon } from '@app/components/documents/new-documents/shared/document-icon';
import { getIsIncomingDocument } from '@app/functions/is-incoming-document';
import { isNotNull } from '@app/functions/is-not-type-guards';
import { DuaActionEnum } from '@app/hooks/dua-access/access';
import { type Dua, useDuaAccess } from '@app/hooks/dua-access/use-dua-access';
import { DistribusjonsType, type IParentDocument } from '@app/types/documents/documents';
import { MenuElipsisVerticalIcon, PadlockLockedIcon } from '@navikt/aksel-icons';
import { Button, Modal } from '@navikt/ds-react';
import { useContext, useState } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

interface DocumentProps extends Props {
  document: IParentDocument;
}

export const DocumentModal = ({ document, isOpen, setIsOpen }: DocumentProps) => {
  const { tittel, type } = document;
  const { close } = useContext(ModalContext);
  const dua: Dua = { creator: document.creator, type: document.type, templateId: document.templateId };
  const renameAccessError = useDuaAccess(dua, DuaActionEnum.RENAME);
  const changeTypeAccessError = useDuaAccess(dua, DuaActionEnum.CHANGE_TYPE);
  const finishAccessError = useDuaAccess(dua, DuaActionEnum.FINISH);
  const { removeDocumentAccessError, removeAttachmentsAccessErrors } = useRemoveDocumentAccessErrors(document);

  const [innsendingshjemlerConfirmed, setInnsendingshjemlerConfirmed] = useState(false);
  const isArchiveOnly =
    document.dokumentTypeId === DistribusjonsType.NOTAT || getIsIncomingDocument(document.dokumentTypeId); // If the document will only be archived on finish. Otherwise it will be archived and sent on finish.

  const finishValidationErrors = useFinishValidationErrors(document, innsendingshjemlerConfirmed, isArchiveOnly);

  const documentErrors = [
    renameAccessError,
    changeTypeAccessError,
    finishAccessError,
    removeDocumentAccessError,
    ...finishValidationErrors,
  ].filter(isNotNull);

  const noAccess =
    renameAccessError !== null &&
    changeTypeAccessError !== null &&
    finishAccessError !== null &&
    removeDocumentAccessError !== null &&
    removeAttachmentsAccessErrors.length !== 0 &&
    finishValidationErrors.length !== 0;

  if (noAccess) {
    return (
      <AccessErrorsSummary documentErrors={documentErrors} attachmentErrors={removeAttachmentsAccessErrors}>
        <PadlockLockedIcon style={{ gridArea: Fields.Action }} className="h-full w-full p-2" />
      </AccessErrorsSummary>
    );
  }

  return (
    <>
      <AccessErrorsSummary
        documentErrors={documentErrors}
        attachmentErrors={removeAttachmentsAccessErrors}
        placement="left"
      >
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
          <DocumentModalContent
            document={document}
            renameAccess={renameAccessError}
            changeTypeAccess={changeTypeAccessError}
            finishAccess={finishAccessError}
            removeAccess={removeDocumentAccessError}
            removeAttachmentsAccess={removeAttachmentsAccessErrors}
            finishValidationErrors={finishValidationErrors}
            innsendingshjemlerConfirmed={innsendingshjemlerConfirmed}
            setInnsendingshjemlerConfirmed={setInnsendingshjemlerConfirmed}
            isArchiveOnly={isArchiveOnly}
          />
        </Modal>
      ) : null}
    </>
  );
};
