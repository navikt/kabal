import React from 'react';
import { DocumentTypeEnum } from '@app/components/show-document/types';
import { useDocumentsPdfViewed } from '@app/hooks/settings/use-setting';
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
      type: DocumentTypeEnum.ARCHIVED,
    });

  const isActive =
    value !== undefined &&
    value.type === DocumentTypeEnum.ARCHIVED &&
    value.dokumentInfoId === dokumentInfoId &&
    value.journalpostId === journalpostId;

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
