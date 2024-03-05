import { FilePdfIcon } from '@navikt/aksel-icons';
import { Button, ButtonProps, LinkProps, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import React, { forwardRef, useContext, useMemo } from 'react';
import { styled } from 'styled-components';
import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import { getMergedDocumentTabId, getMergedDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { MOD_KEY } from '@app/keys';
import {
  useGetArkiverteDokumenterQuery,
  useMergedDocumentsReferenceQuery,
} from '@app/redux-api/oppgaver/queries/documents';

export const ViewCombinedPDF = () => {
  const { getTabRef, setTabRef } = useContext(TabContext);
  const { value, setValue } = useDocumentsPdfViewed();
  const { selectedDocuments, selectedCount } = useContext(SelectContext);
  const { data: archivedList, isLoading: archivedIsLoading } = useGetArkiverteDokumenterQuery(useOppgaveId());

  const documents = useMemo(
    () =>
      archivedList === undefined
        ? undefined
        : getSelectedDocumentsInOrder(selectedDocuments, archivedList.dokumenter, selectedCount),
    [archivedList, selectedCount, selectedDocuments],
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
  margin: var(--a-spacing-1) var(--a-spacing-4) var(--a-spacing-3);

  &:visited {
    color: var(--a-text-visited);
    box-shadow: inset 0 0 0 2px var(--a-text-visited);
  }
`;
