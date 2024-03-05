import React, { useCallback, useContext, useMemo } from 'react';
import { StyledDocumentTitle } from '@app/components/documents/new-documents/new-document/title-style';
import { TabContext } from '@app/components/documents/tab-context';
import { useIsTabOpen } from '@app/components/documents/use-is-tab-open';
import { toast } from '@app/components/toast/store';
import {
  getAttachmentsOverviewTabId,
  getJournalfoertDocumentTabId,
  getNewDocumentTabId,
} from '@app/domain/tabbed-document-url';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { MouseButtons } from '@app/keys';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { IJournalfoertDokumentId } from '@app/types/oppgave-common';
import { EllipsisTitle, StyledDocumentLink } from '../../styled-components/document-link';

interface BaseProps {
  title: string;
  url: string;
  documentId: string;
  icon: React.ReactNode;
  disabled?: boolean;
  children?: React.ReactNode;
}

interface JournalfoertProps extends BaseProps {
  type: DocumentTypeEnum.JOURNALFOERT;
  journalfoertDokumentReference: IJournalfoertDokumentId;
}

interface NotJournalfoertProps extends BaseProps {
  type: Exclude<DocumentTypeEnum, DocumentTypeEnum.JOURNALFOERT>;
  journalfoertDokumentReference?: never;
}

type Props = JournalfoertProps | NotJournalfoertProps;

export const SharedDocumentTitle = ({ title, url, documentId, icon, disabled = false, children, ...rest }: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();
  const { getTabRef, setTabRef } = useContext(TabContext);

  const tabId = useMemo<string>(() => {
    if (rest.type === DocumentTypeEnum.JOURNALFOERT) {
      return getJournalfoertDocumentTabId(
        rest.journalfoertDokumentReference.journalpostId,
        rest.journalfoertDokumentReference.dokumentInfoId,
      );
    }

    if (rest.type === DocumentTypeEnum.VEDLEGGSOVERSIKT) {
      return getAttachmentsOverviewTabId(documentId);
    }

    return getNewDocumentTabId(documentId);
  }, [documentId, rest]);

  const isTabOpen = useIsTabOpen(tabId);

  const isInlineOpen = useMemo(
    () =>
      value.some((v) => {
        if (rest.type === DocumentTypeEnum.JOURNALFOERT) {
          return (
            v.type === DocumentTypeEnum.JOURNALFOERT &&
            v.dokumentInfoId === rest.journalfoertDokumentReference.dokumentInfoId
          );
        }

        return v.type === rest.type && v.documentId === documentId;
      }),
    [documentId, rest.journalfoertDokumentReference, rest.type, value],
  );

  const setViewedDocument = useCallback(() => {
    if (rest.type === DocumentTypeEnum.JOURNALFOERT) {
      setValue([
        {
          type: rest.type,
          ...rest.journalfoertDokumentReference,
        },
      ]);

      return;
    }

    setValue([
      {
        type: rest.type,
        documentId,
      },
    ]);
  }, [rest.type, rest.journalfoertDokumentReference, setValue, documentId]);

  const onClick: React.MouseEventHandler<HTMLAnchorElement> = useCallback(
    (e) => {
      if (disabled || e.button === MouseButtons.RIGHT) {
        return;
      }

      e.preventDefault();

      if (disabled) {
        return;
      }

      const shouldOpenInNewTab = e.ctrlKey || e.metaKey || e.button === MouseButtons.MIDDLE;

      // Open in PDF-viewer panel.
      if (!shouldOpenInNewTab) {
        setViewedDocument();

        return;
      }

      const tabRef = getTabRef(tabId);

      // There is a reference to the tab and it is open.
      if (tabRef !== undefined && !tabRef.closed) {
        tabRef.focus();

        return;
      }

      if (isTabOpen) {
        toast.warning('Dokumentet er allerede åpent i en annen fane');

        return;
      }

      // There is no reference to the tab or it is closed.
      const newTabRef = window.open(url, tabId);

      if (newTabRef === null) {
        toast.error('Kunne ikke åpne dokument i ny fane');

        return;
      }

      setTabRef(tabId, newTabRef);
    },
    [disabled, getTabRef, isTabOpen, url, setTabRef, tabId, setViewedDocument],
  );

  return (
    <StyledDocumentTitle>
      <StyledDocumentLink
        $disabled={disabled}
        $isActive={isInlineOpen || isTabOpen}
        aria-pressed={isInlineOpen || isTabOpen}
        onClick={onClick}
        onAuxClick={onClick}
        data-testid="document-open-button"
        href={url}
        target={tabId}
      >
        {icon}
        <EllipsisTitle title={title}>{title}</EllipsisTitle>
      </StyledDocumentLink>
      {children}
    </StyledDocumentTitle>
  );
};
