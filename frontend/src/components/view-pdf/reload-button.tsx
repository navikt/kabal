import type { IShownDocumentList } from '@app/components/view-pdf/types';
import { DocumentTypeEnum } from '@app/types/documents/documents';
import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface Props {
  showDocumentList: IShownDocumentList;
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
