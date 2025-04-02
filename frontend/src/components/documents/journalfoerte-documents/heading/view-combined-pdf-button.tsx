import { getSelectedDocumentsInOrder } from '@app/components/documents/journalfoerte-documents/heading/selected-in-order';
import { SelectContext } from '@app/components/documents/journalfoerte-documents/select-context/select-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { getMergedDocumentTabId, getMergedDocumentTabUrl } from '@app/domain/tabbed-document-url';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { ViewDocumentMode, useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { useHandleTab } from '@app/hooks/use-handle-tab';
import { MOD_KEY } from '@app/keys';
import {
  useGetArkiverteDokumenterQuery,
  useMergedDocumentsReferenceQuery,
} from '@app/redux-api/oppgaver/queries/documents';
import { FilePdfIcon } from '@navikt/aksel-icons';
import { Button, type ButtonProps, type LinkProps, Tooltip } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { forwardRef, useContext, useMemo } from 'react';
import { styled } from 'styled-components';

export const ViewCombinedPDF = () => {
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

    if (value.documents.length !== documents.length) {
      return false;
    }

    return value.documents.every((v, i) => {
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

  const handleTab = useHandleTab(tabUrl, documentId);
  const isTabOpen = useIsTabOpen(documentId);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === 1;

    if (!shouldOpenInNewTab) {
      if (documents !== undefined) {
        setValue(documents, ViewDocumentMode.MERGED);
      }

      return;
    }

    handleTab();
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
  text-shadow: ${({ $isActive }) => ($isActive ? '0 0 1px var(--a-surface-neutral-active)' : 'none')};
  margin: var(--a-spacing-1) var(--a-spacing-4) var(--a-spacing-3);

  &:visited {
    color: var(--a-text-visited);
    box-shadow: inset 0 0 0 var(--a-spacing-05) var(--a-text-visited);
  }
`;
