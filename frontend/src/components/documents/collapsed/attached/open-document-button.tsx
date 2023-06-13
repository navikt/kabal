import React, { useMemo } from 'react';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ViewDocumentButton } from '../styled-components/document';

interface Props {
  title: string;
  journalpostId: string;
  dokumentInfoId: string;
  valgt: boolean;
  harTilgangTilArkivvariant: boolean;
}

export const OpenDocumentButton = ({
  dokumentInfoId,
  journalpostId,
  title,
  valgt,
  harTilgangTilArkivvariant,
}: Props) => {
  const { value, setValue } = useDocumentsPdfViewed();

  const onClick = () =>
    setValue({
      dokumentInfoId,
      journalpostId,
      type: DocumentTypeEnum.JOURNALFOERT,
    });

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

  return (
    <ViewDocumentButton
      isActive={isActive}
      tilknyttet={valgt}
      onClick={onClick}
      disabled={!harTilgangTilArkivvariant}
      title={harTilgangTilArkivvariant ? undefined : 'Du har ikke tilgang til å se dette dokumentet.'}
    >
      {title}
    </ViewDocumentButton>
  );
};
