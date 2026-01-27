import { isNotUndefined } from '@app/functions/is-not-type-guards';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import type { IYtelse } from '@app/types/kodeverk';
import { Box, ErrorMessage, Heading, Loader, Search, VStack } from '@navikt/ds-react';
import { useMemo, useRef, useState } from 'react';
import { Direction } from '../../deassign/direction';
import { FilterList } from '../../filter-dropdown/filter-list';

interface CommonProps {
  selected: string[];
  onChange: (hjemler: string[]) => void;
  direction: Direction;
  error: string | null;
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

export const HjemmelListContent = ({
  selected,
  direction,
  onChange,
  error,
  ytelse,
}: CommonProps & { ytelse: IYtelse }) => {
  const [search, setSearch] = useState('');
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

  const hasFilter = options.length > 10;
  const isUp = direction === Direction.UP;

  return (
    <VStack
      asChild
      gap="space-8"
      padding="space-8"
      minWidth="200px"
      position="absolute"
      bottom={isUp ? 'space-0' : undefined}
      top={isUp ? undefined : 'space-0'}
      className="left-full"
    >
      <Box background="default" borderRadius="4" borderColor="neutral" borderWidth="1" shadow="dialog">
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
            />
            <hr className="m-0 border-ax-border-neutral border-b" />
          </>
        ) : null}
        <FilterList
          options={filteredOptions}
          selected={selected}
          onChange={onChange}
          error={error}
          className="max-h-[min(50vh,400px)] overflow-y-auto"
        />
      </Box>
    </VStack>
  );
};
