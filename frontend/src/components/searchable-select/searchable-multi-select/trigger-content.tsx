import { BodyShort, Tag } from '@navikt/ds-react';
import type { ReactNode } from 'react';

interface TriggerContentProps<T> {
  display: 'pills' | 'count';
  value: T[];
  valueKey: (option: T) => string;
  formatOption: (option: T) => ReactNode;
  emptyLabel: string;
}

export const TriggerContent = <T,>({ display, value, valueKey, formatOption, emptyLabel }: TriggerContentProps<T>) => {
  if (display === 'count') {
    return <span className="truncate">{value.length === 0 ? emptyLabel : `${emptyLabel} (${value.length})`}</span>;
  }

  return (
    <span className="flex min-w-0 grow flex-wrap items-center gap-1">
      {value.length === 0 ? (
        <BodyShort as="span" size="small" className="px-0.5 text-ax-text-subtle">
          {emptyLabel}
        </BodyShort>
      ) : (
        value.map((option) => (
          <Tag key={valueKey(option)} data-color="info" size="xsmall" variant="outline" className="truncate">
            {formatOption(option)}
          </Tag>
        ))
      )}
    </span>
  );
};
