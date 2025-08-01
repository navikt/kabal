import { stringToRegExp } from '@app/functions/string-to-regex';
import { Keys } from '@app/keys';
import { TrashIcon } from '@navikt/aksel-icons';
import { BoxNew, Button, HStack, Search } from '@navikt/ds-react';
import { type KeyboardEventHandler, useRef } from 'react';

interface HeaderProps {
  focused: number;
  optionsCount: number;
  showFjernAlle?: boolean;
  close: () => void;
  onReset: () => void;
  onFocusChange: (focused: number) => void;
  onSelect: () => void;
  onFilterChange: (query: RegExp) => void;
}

export const Header = ({
  optionsCount,
  onSelect,
  focused,
  onFocusChange,
  onFilterChange,
  close,
  onReset,
  showFjernAlle = true,
}: HeaderProps): React.JSX.Element | null => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onInputChange = (value: string) => onFilterChange(stringToRegExp(value));

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === Keys.Escape) {
      event.stopPropagation();
      onFocusChange(-1);

      return close();
    }

    if (event.key === Keys.ArrowDown) {
      event.preventDefault();

      if (focused === optionsCount - 1) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

        return onFocusChange(-1);
      }

      return onFocusChange(focused + 1);
    }

    if (event.key === Keys.ArrowUp) {
      event.preventDefault();

      if (focused === -1) {
        return onFocusChange(optionsCount - 1);
      }

      if (focused === 0) {
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      return onFocusChange(focused - 1);
    }

    if (
      (event.key === Keys.Enter || (event.key === Keys.Space && focused !== -1)) &&
      focused < optionsCount &&
      focused !== -1
    ) {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <HStack asChild justify="space-between" position="sticky" top="0" padding="2" wrap={false} className="z-1">
      <BoxNew borderWidth="0 0 1 0" borderColor="neutral" background="default">
        <Search
          onChange={onInputChange}
          defaultValue=""
          placeholder="Søk"
          label="Søk"
          hideLabel
          onKeyDown={onKeyDown}
          autoFocus
          size="small"
          variant="simple"
          ref={inputRef}
          data-testid="header-filter"
        />
        {showFjernAlle && (
          <Button
            size="xsmall"
            variant="danger"
            onClick={onReset}
            icon={<TrashIcon aria-hidden />}
            className="ml-2 shrink-0"
          >
            Fjern alle
          </Button>
        )}
      </BoxNew>
    </HStack>
  );
};
