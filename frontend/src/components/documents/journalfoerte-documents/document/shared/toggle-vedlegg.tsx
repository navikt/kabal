import { ChevronRightDoubleIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { Fields } from '@/components/documents/journalfoerte-documents/grid';

interface Props {
  hasVedlegg: boolean;
  showVedlegg: boolean;
  toggleShowVedlegg: () => void;
}

export const ToggleVedleggButton = ({ hasVedlegg, showVedlegg, toggleShowVedlegg }: Props) => {
  const Icon = hasVedlegg ? ChevronRightDoubleIcon : ChevronRightIcon;
  const label = showVedlegg ? 'Skjul vedlegg' : 'Vis vedlegg';

  return (
    <Button
      data-color="neutral"
      variant="tertiary"
      size="small"
      icon={<Icon aria-hidden className={showVedlegg ? 'rotate-90' : 'rotate-0'} />}
      onClick={(e) => {
        e.stopPropagation();
        toggleShowVedlegg();
      }}
      aria-label={label}
      style={{ gridArea: Fields.ToggleVedlegg }}
      tabIndex={-1}
    />
  );
};
