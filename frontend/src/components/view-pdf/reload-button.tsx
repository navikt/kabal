import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { IShownDocument } from './types';

interface Props {
  showDocumentList: IShownDocument[];
  isLoading: boolean;
  onClick: () => void;
}

export const ReloadButton = ({ showDocumentList, isLoading, onClick }: Props) => {
  if (
    !showDocumentList.some((v) => v.type === DocumentTypeEnum.SMART || v.type === DocumentTypeEnum.VEDLEGGSOVERSIKT)
  ) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      title="Oppdater"
      loading={isLoading}
      icon={<ArrowsCirclepathIcon aria-hidden />}
      size="xsmall"
      variant="tertiary-neutral"
    />
  );
};
