import { Checkbox, HStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface FilterProps<T extends string> {
  filterId: T;
  children: string;
  focused: boolean;
  disabled?: boolean;
  tags?: React.ReactNode[];
}

export const Filter = <T extends string>({
  filterId,
  children,
  focused,
  disabled,
  tags,
}: FilterProps<T>): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focused && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused]);

  return (
    <Checkbox
      data-testid="filter"
      data-filterid={filterId}
      data-label={children}
      type="checkbox"
      disabled={disabled}
      size="small"
      ref={ref}
      title={children}
      value={filterId}
    >
      <HStack align="center" gap="0 1">
        <span title={children}>{children}</span>
        {tags}
      </HStack>
    </Checkbox>
  );
};

Filter.displayName = 'Filter';
