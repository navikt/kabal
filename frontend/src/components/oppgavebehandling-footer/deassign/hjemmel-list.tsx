import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import { BoxNew, Heading, Loader, Search, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { Direction } from '../../deassign/direction';
import { FilterList } from '../../filter-dropdown/filter-list';

interface Props {
  selected: string[];
  onChange: (hjemler: string[]) => void;
  ytelseId: string;
  direction: Direction;
  error: string | null;
}

export const HjemmelList = ({ selected, ytelseId, direction, onChange, error }: Props) => {
  const [ytelse, ytelseIsLoading] = useKodeverkYtelse(ytelseId);
  const [search, setSearch] = useState('');
  const filterRegex = useMemo(() => stringToRegExp(search), [search]);

  const options = useMemo(
    () => ytelse?.innsendingshjemler.map(({ id, navn }) => ({ value: id, label: navn })) ?? [],
    [ytelse?.innsendingshjemler],
  );

  const filteredOptions = useMemo(
    () => options.filter((option) => filterRegex.test(option.label)),
    [options, filterRegex],
  );

  const hasFilter = options.length > 10;
  const isUp = direction === Direction.UP;

  return (
    <VStack
      asChild
      gap="2"
      padding="2"
      minWidth="200px"
      position="absolute"
      bottom={isUp ? '0' : undefined}
      top={isUp ? undefined : '0'}
      className="left-full"
    >
      <BoxNew background="default" borderRadius="medium" borderColor="neutral" borderWidth="1" shadow="dialog">
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
        {ytelseIsLoading ? (
          <Loader title="Laster..." className="m-2" />
        ) : (
          <FilterList
            options={filteredOptions}
            selected={selected}
            onChange={onChange}
            error={error}
            className="max-h-[min(50vh,400px)] overflow-y-auto"
          />
        )}
      </BoxNew>
    </VStack>
  );
};
