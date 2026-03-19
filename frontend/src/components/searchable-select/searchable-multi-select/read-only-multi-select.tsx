import { BodyShort, Tag } from '@navikt/ds-react';
import type { SearchableMultiSelectProps } from '@/components/searchable-select/searchable-multi-select/types';

export const ReadOnlyMultiSelect = <T,>({
  id,
  label,
  value,
  valueKey,
  formatOption,
  emptyLabel,
}: SearchableMultiSelectProps<T>) => {
  if (value.length === 0) {
    return (
      <BodyShort as="span" size="small" className="px-0.5 text-ax-text-subtle">
        {emptyLabel}
      </BodyShort>
    );
  }

  return (
    <ul id={id} aria-label={label} className="flex min-w-0 flex-wrap items-center gap-1 border-none">
      {value.map((option) => (
        <li key={valueKey(option)}>
          <Tag data-color="info" size="xsmall" variant="outline" className="truncate">
            {formatOption(option)}
          </Tag>
        </li>
      ))}
    </ul>
  );
};
