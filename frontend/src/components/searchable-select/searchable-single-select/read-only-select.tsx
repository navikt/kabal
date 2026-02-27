import type { SearchableSelectProps } from '@app/components/searchable-select/searchable-single-select/types';
import { BodyShort } from '@navikt/ds-react';

export const ReadOnlySelect = <T,>({ id, value, formatLabel, size = 'small' }: SearchableSelectProps<T>) => (
  <span id={id} className="inline-flex min-w-0 items-center">
    <BodyShort as="span" size={size}>
      {formatLabel(value)}
    </BodyShort>
  </span>
);
