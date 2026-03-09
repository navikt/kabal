import { Checkbox, HStack } from '@navikt/ds-react';
import { useEffect, useRef } from 'react';

interface Props<T extends string> {
  filterId: T;
  children: string;
  focused: boolean;
  disabled?: boolean;
  tags?: React.ReactNode[];
}

export const Option = <T extends string>({
  filterId,
  children,
  focused,
  disabled,
  tags,
}: Props<T>): React.JSX.Element => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused && wrapperRef.current) {
      wrapperRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [focused]);

  return (
    <div
      ref={wrapperRef}
      className={
        focused ? 'w-full scroll-my-4 rounded px-1 outline outline-ax-border-focus' : 'w-full scroll-my-4 rounded px-1'
      }
    >
      <Checkbox
        data-testid="filter"
        data-filterid={filterId}
        data-label={children}
        type="checkbox"
        disabled={disabled}
        size="small"
        title={children}
        value={filterId}
        className="py-1.5"
      >
        <HStack align="center" gap="space-0 space-4" wrap={false}>
          <span title={children} className="truncate">
            {children}
          </span>
          {tags}
        </HStack>
      </Checkbox>
    </div>
  );
};
