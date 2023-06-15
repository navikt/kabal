import React, { memo, useMemo, useState } from 'react';
import { StyledDocumentTitle } from '@app/components/documents/journalfoerte-documents/document/shared/document-title-style';
import { useIsExpanded } from '@app/components/documents/use-is-expanded';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentButton } from '../../../styled-components/document-button';
import { DocumentTitleActions } from './document-title-actions';
import { SetFilename } from './set-filename';

interface Props {
  journalpostId: string;
  dokumentInfoId: string;
  tittel: string;
  harTilgangTilArkivvariant: boolean;
}

export const DocumentTitle = memo(
  ({ journalpostId, dokumentInfoId, tittel, harTilgangTilArkivvariant }: Props) => {
    const { value, setValue } = useDocumentsPdfViewed();
    const [isExpanded] = useIsExpanded();

    const [editMode, setEditMode] = useState(false);

    const isActive = useMemo(
      () =>
        value.some(
          (v) =>
            v.type === DocumentTypeEnum.JOURNALFOERT &&
            v.dokumentInfoId === dokumentInfoId &&
            v.journalpostId === journalpostId
        ),
      [dokumentInfoId, journalpostId, value]
    );

    if (editMode) {
      return (
        <StyledDocumentTitle>
          <SetFilename
            journalpostId={journalpostId}
            dokumentInfoId={dokumentInfoId}
            tittel={tittel}
            onDone={() => setEditMode(false)}
          />
          <DocumentTitleActions
            editMode={editMode}
            setEditMode={setEditMode}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel}
          />
        </StyledDocumentTitle>
      );
    }

    const onClick = () =>
      setValue({
        type: DocumentTypeEnum.JOURNALFOERT,
        dokumentInfoId,
        journalpostId,
      });

    return (
      <StyledDocumentTitle>
        <StyledDocumentButton
          isActive={isActive}
          onClick={onClick}
          disabled={!harTilgangTilArkivvariant}
          data-testid="document-open-button"
        >
          <EllipsisTitle title={tittel}>{tittel}</EllipsisTitle>
        </StyledDocumentButton>
        {isExpanded ? (
          <DocumentTitleActions
            editMode={editMode}
            setEditMode={setEditMode}
            harTilgangTilArkivvariant={harTilgangTilArkivvariant}
            tittel={tittel}
          />
        ) : null}
      </StyledDocumentTitle>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tittel === nextProps.tittel &&
    prevProps.harTilgangTilArkivvariant === nextProps.harTilgangTilArkivvariant &&
    prevProps.dokumentInfoId === nextProps.dokumentInfoId &&
    prevProps.journalpostId === nextProps.journalpostId
);

DocumentTitle.displayName = 'DocumentTitle';
