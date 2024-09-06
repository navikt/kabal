import { Heading, Loader, Search } from '@navikt/ds-react';
import { useMemo, useState } from 'react';
import { styled } from 'styled-components';
import { stringToRegExp } from '@app/functions/string-to-regex';
import { useKodeverkYtelse } from '@app/hooks/use-kodeverk-value';
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
    <Container style={{ [direction === Direction.UP ? 'bottom' : 'top']: '0' }}>
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
    </Container>
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  gap: var(--a-spacing-2);
  right: 100%;
  min-width: 200px;
  padding: var(--a-spacing-2);

  background-color: var(--a-bg-default);
  border-radius: var(--a-border-radius-medium);
  border: 1px solid var(--a-border-divider);
  box-shadow: var(--a-shadow-medium);
`;
