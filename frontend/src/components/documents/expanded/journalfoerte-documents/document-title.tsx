import React, { memo, useMemo, useState } from 'react';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { EllipsisTitle, StyledDocumentButton } from '../../styled-components/document-button';
import { StyledDocumentTitle } from '../styled-components/document';
import { EditButton } from './document-title-edit-button';
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
          <EditButton
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
        <EditButton
          editMode={editMode}
          setEditMode={setEditMode}
          harTilgangTilArkivvariant={harTilgangTilArkivvariant}
          tittel={tittel}
        />
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
