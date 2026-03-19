import { BodyShort } from '@navikt/ds-react';
import type { SearchableSelectProps } from '@/components/searchable-select/searchable-single-select/types';

export const ReadOnlySelect = <T,>({ id, value, formatLabel, size = 'small' }: SearchableSelectProps<T>) => (
  <span id={id} className="inline-flex min-w-0 items-center">
    <BodyShort as="span" size={size}>
      {formatLabel(value)}
    </BodyShort>
  </span>
);
