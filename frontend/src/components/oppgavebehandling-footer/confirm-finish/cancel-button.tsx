import { XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import type { CancelButtonProps } from '@/components/oppgavebehandling-footer/confirm-finish/types';

export const CancelButton = ({ cancel }: CancelButtonProps) => (
  <Button
    data-color="neutral"
    className="ml-auto shrink-0"
    variant="secondary"
    type="button"
    size="small"
    onClick={cancel}
    icon={<XMarkIcon aria-hidden />}
  >
    Avbryt
  </Button>
);
