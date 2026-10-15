import type { ButtonProps } from '@navikt/ds-react';

export const filterTriggerVariant = (length: number): ButtonProps['variant'] =>
  length > 0 ? 'primary-neutral' : 'tertiary-neutral';
