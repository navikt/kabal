import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
import { Box, Heading, Loader, Search, VStack } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
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

  return (
    <VStack
      asChild
      gap="2"
      padding="2"
      minWidth="200px"
      position="absolute"
      style={{ left: '100%', [direction === Direction.UP ? 'bottom' : 'top']: '0', zIndex: 10 }}
    >
      <Box background="bg-default" borderRadius="medium" borderColor="border-divider" borderWidth="1" shadow="medium">
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
            <StyledHr />
          </>
        ) : null}
        {ytelseIsLoading ? (
          <StyledLoader title="Laster..." />
        ) : (
          <StyledFilterList options={filteredOptions} selected={selected} onChange={onChange} error={error} />
        )}
      </Box>
    </VStack>
  );
};

const StyledLoader = styled(Loader)`
  margin: var(--a-spacing-2);
`;

const StyledHr = styled.hr`
  margin: 0;
  border: none;
  border-bottom: 1px solid var(--a-border-divider);
`;

const StyledFilterList = styled(FilterList)`
  max-height: min(50vh, 400px);
  overflow-y: auto;
`;
