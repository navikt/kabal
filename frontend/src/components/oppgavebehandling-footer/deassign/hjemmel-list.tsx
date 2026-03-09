import { Direction } from '@app/components/deassign/direction';
import { FilterList } from '@app/components/filter-dropdown/filter-list';
import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import { Keys } from '@app/keys';
import type { IYtelse } from '@app/types/kodeverk';
import { Box, ErrorMessage, Heading, Loader, Search, VStack } from '@navikt/ds-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface CommonProps {
  selected: string[];
  onChange: (hjemler: string[]) => void;
  direction: Direction;
  error: string | null;
  onEscape?: () => void;
}

export const HjemmelList = ({ ytelseId, ...props }: CommonProps & { ytelseId: string }) => {
  const [ytelse, isLoading] = useKodeverkYtelse(ytelseId);

  if (isLoading) {
    return (
      <VStack>
        <Loader title="Laster..." className="m-2" />
      </VStack>
    );
  }

  if (ytelse === undefined) {
    return <ErrorMessage>Kunne ikke finne ytelse med id: {ytelseId}</ErrorMessage>;
  }

  return <HjemmelListContent {...props} ytelse={ytelse} />;
};

interface InnerProps {
  selected: string[];
  onChange: (hjemler: string[]) => void;
  error: string | null;
  ytelse: IYtelse;
  onEscape?: () => void;
}

/** Inner content of the hjemmel list without positioning or box wrapper. Suitable for use inside a Popover. */
export const HjemmelListInner = ({ selected, onChange, error, ytelse, onEscape }: InnerProps) => {
  const [search, setSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const filterRegex = useMemo(() => stringToRegExp(search), [search]);

  const selectedUtfasesIds = useRef(
    selected.filter((s) => ytelse.innsendingshjemler.find((h) => h.id === s)?.utfases === true),
  );

  const options = useMemo(() => {
    const selectedUtfasesOptions = selectedUtfasesIds.current
      .map((id) => {
        const hjemmel = ytelse.innsendingshjemler.find((h) => h.id === id);

        if (hjemmel === undefined) {
          return undefined;
        }

        return { value: hjemmel.id, label: `${hjemmel.navn} (utfases)` };
      })
      .filter(isNotUndefined);

    return ytelse.innsendingshjemler
      .filter(({ utfases }) => !utfases)
      .map(({ id, navn }) => ({ value: id, label: navn }))
      .concat(selectedUtfasesOptions)
      .toSorted((a, b) => a.label.localeCompare(b.label));
  }, [ytelse.innsendingshjemler]);

  const filteredOptions = useMemo(
    () => options.filter((option) => filterRegex.test(option.label)),
    [options, filterRegex],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: search is intentionally a dependency to reset highlight on search change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [search]);

  const focusedOption = filteredOptions[highlightedIndex] ?? null;

  const toggleHighlighted = useCallback(() => {
    const option = filteredOptions[highlightedIndex];

    if (option === undefined) {
      return;
    }

    const isSelected = selected.includes(option.value);

    if (isSelected) {
      onChange(selected.filter((s) => s !== option.value));
    } else {
      onChange([...selected, option.value]);
    }
  }, [filteredOptions, highlightedIndex, selected, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case Keys.ArrowDown: {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
          break;
        }
        case Keys.ArrowUp: {
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
          break;
        }
        case Keys.Home: {
          e.preventDefault();
          setHighlightedIndex(0);
          break;
        }
        case Keys.End: {
          e.preventDefault();
          setHighlightedIndex(filteredOptions.length - 1);
          break;
        }
        case Keys.Enter:
        case Keys.Space: {
          e.preventDefault();
          toggleHighlighted();
          break;
        }
        case Keys.Escape: {
          e.preventDefault();
          e.stopPropagation();
          onEscape?.();
          break;
        }
      }
    },
    [filteredOptions.length, toggleHighlighted, onEscape],
  );

  const hasFilter = options.length > 10;

  return (
    <VStack gap="space-8" minWidth="200px" onKeyDown={handleKeyDown}>
      <Heading level="1" size="small">
        Endre hjemmel?
      </Heading>
      {hasFilter ? (
        <>
          <Search
            label="Filtrer hjemlene"
            placeholder="Filtrer hjemlene"
            onChange={setSearch}
            value={search}
            size="small"
            variant="simple"
            autoFocus
          />
          <hr className="m-0 border-ax-border-neutral border-b" />
        </>
      ) : null}
      <FilterList
        options={filteredOptions}
        selected={selected}
        onChange={onChange}
        focused={focusedOption}
        error={error}
        className="max-h-[min(50vh,400px)] overflow-y-auto p-0.5"
      />
    </VStack>
  );
};

interface PopoverContentProps {
  selected: string[];
  onChange: (hjemler: string[]) => void;
  error: string | null;
  ytelseId: string;
  onEscape?: () => void;
}

/** HjemmelList content without positioning or box wrapper. Suitable for use inside a Popover. */
export const HjemmelListPopoverContent = ({ ytelseId, ...props }: PopoverContentProps) => {
  const [ytelse, isLoading] = useKodeverkYtelse(ytelseId);

  if (isLoading) {
    return (
      <VStack>
        <Loader title="Laster..." className="m-2" />
      </VStack>
    );
  }

  if (ytelse === undefined) {
    return <ErrorMessage>Kunne ikke finne ytelse med id: {ytelseId}</ErrorMessage>;
  }

  return <HjemmelListInner {...props} ytelse={ytelse} />;
};

export const HjemmelListContent = ({
  selected,
  direction,
  onChange,
  error,
  ytelse,
  onEscape,
}: CommonProps & { ytelse: IYtelse }) => {
  const isUp = direction === Direction.UP;

  return (
    <Box
      position="absolute"
      bottom={isUp ? 'space-0' : undefined}
      top={isUp ? undefined : 'space-0'}
      className="left-full"
      background="default"
      borderRadius="4"
      borderColor="neutral"
      borderWidth="1"
      shadow="dialog"
      padding="space-16"
    >
      <HjemmelListInner selected={selected} onChange={onChange} error={error} ytelse={ytelse} onEscape={onEscape} />
    </Box>
  );
};
