import { FilePdfIcon, MenuHamburgerIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, LinkProps, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import React, { forwardRef, useContext, useMemo, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import { UseAsAttachments } from '@app/components/documents/journalfoerte-documents/heading/use-as-attachments';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { getMergedDocumentTabId, getMergedDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { MOD_KEY } from '@app/mod-key';
import {
  useGetArkiverteDokumenterQuery,
  useMergedDocumentsReferenceQuery,
} from '@app/redux-api/oppgaver/queries/documents';

export const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedDocuments } = useContext(SelectContext);
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  const documentCount = Object.keys(selectedDocuments).length;

  if (documentCount === 0) {
    return null;
  }

  return (
    <StyledMenu ref={ref}>
      <Button
        variant="tertiary-neutral"
        icon={<MenuHamburgerIcon aria-hidden />}
        onClick={() => setIsOpen(!isOpen)}
        size="small"
        title="Verktøy for dokumenter"
      />
      {isOpen && (
        <Dropdown>
          {documentCount > 1 ? <ViewCombinedPDF /> : null}
          <UseAsAttachments />
        </Dropdown>
      )}
    </StyledMenu>
  );
};

const StyledMenu = styled.div`
  position: relative;
  margin-left: auto;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 2;
  background-color: var(--a-bg-default);
  border-radius: 4px;
  box-shadow: var(--a-shadow-small);
  padding: 0.5rem;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ViewCombinedPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value, setValue } = useDocumentsPdfViewed();
  const { selectedDocuments } = useContext(SelectContext);
  const { data: archivedList, isLoading: archivedIsLoading } = useGetArkiverteDokumenterQuery(useOppgaveId());

  const documents = useMemo(
    () =>
      archivedList === undefined ? undefined : getSelectedDocumentsInOrder(selectedDocuments, archivedList.dokumenter),
    [archivedList, selectedDocuments],
  );

  const isInlineOpen = useMemo(() => {
    if (documents === undefined) {
      return false;
    }

    if (value.length !== documents.length) {
      return false;
    }

    return value.every((v, i) => {
      const d = documents[i];

      return d !== undefined && d.type === v.type && v.dokumentInfoId === d.dokumentInfoId;
    });
  }, [documents, value]);

  const { data: mergedDocumentRef, isLoading, isFetching } = useMergedDocumentsReferenceQuery(documents ?? skipToken);

  const { tabUrl, documentId } = useMemo(() => {
    if (mergedDocumentRef === undefined) {
      return {
        tabUrl: undefined,
        documentId: undefined,
      };
    }

    return {
      tabUrl: getMergedDocumentTabUrl(mergedDocumentRef.reference),
      documentId: getMergedDocumentTabId(mergedDocumentRef.reference),
    };
  }, [mergedDocumentRef]);

  const isTabOpen = useIsTabOpen(documentId);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === 1;

    if (!shouldOpenInNewTab) {
      if (documents !== undefined) {
        setValue(documents);
      }

      return;
    }

    if (documentId === undefined) {
      toast.error('Kunne ikke generere kombinert dokument');

      return;
    }

    const tabRef = getTabRef(documentId);

    // There is a reference to the tab and it is open.
    if (tabRef !== undefined && !tabRef.closed) {
      tabRef.focus();

      return;
    }

    if (isTabOpen) {
      toast.warning('Dokumentet er allerede åpent i en annen fane');

      return;
    }

    const newTabRef = window.open(tabUrl, documentId);

    if (newTabRef === null) {
      toast.error('Kunne ikke åpne ny fane');

      return;
    }

    setTabRef(documentId, newTabRef);
  };

  return (
    <Tooltip content={`Trykk med musehjulet/midterste knapp eller ${MOD_KEY} + klikk for å åpne i ny fane.`}>
      <StyledOpenButton
        onClick={onClick}
        onAuxClick={onClick}
        href={tabUrl}
        loading={isLoading || isFetching || archivedIsLoading}
        $isActive={isTabOpen || isInlineOpen}
      >
        Vis kombinert dokument
      </StyledOpenButton>
    </Tooltip>
  );
};

interface OpenButtonProps extends ButtonProps, Pick<LinkProps, 'href'> {
  $isActive: boolean;
}

const OpenButton = forwardRef<HTMLAnchorElement, OpenButtonProps>((props, ref) => (
  <Button {...props} as="a" variant="secondary" size="small" icon={<FilePdfIcon />} ref={ref} />
));

OpenButton.displayName = 'OpenButton';

const StyledOpenButton = styled(OpenButton)`
  text-shadow: ${({ $isActive }) => ($isActive ? '0 0 1px #262626' : 'none')};

  &:visited {
    color: var(--a-text-visited);
    box-shadow: inset 0 0 0 2px var(--a-text-visited);
  }
`;
