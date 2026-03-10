import { ArrowsCirclepathIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

interface Props {
  isLoading: boolean;
  onClick: () => void;
}

export const ReloadButton = ({ isLoading, onClick }: Props) => (
  <Button
    data-color="neutral"
    onClick={onClick}
    title="Oppdater"
    loading={isLoading}
    icon={<ArrowsCirclepathIcon aria-hidden />}
    size="xsmall"
    variant="tertiary"
  />
);
