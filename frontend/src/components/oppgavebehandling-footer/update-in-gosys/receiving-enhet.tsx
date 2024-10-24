import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { SuggestedEnhet } from '@app/components/oppgavebehandling-footer/update-in-gosys/suggested-enhet';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import type { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, Button, ErrorMessage, Search, Tooltip } from '@navikt/ds-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

interface Props {
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
  error: string | null;
  enheter: Enhet[];
  oppgavebehandling: IOppgavebehandling;
}

interface ScoredEnhet extends Enhet {
  score: number;
}

const getFiltered = (enheter: ScoredEnhet[], name: string): ScoredEnhet[] => {
  if (name.length === 0) {
    return enheter;
  }

  const filtered: ScoredEnhet[] = [];
  const nameQuery = splitQuery(name);

  for (const enhet of enheter) {
    const score = fuzzySearch(nameQuery, `${enhet.enhetsnr} - ${enhet.navn}`);

    if (score > 0) {
      filtered.push({ ...enhet, score });
    }
  }

  return filtered;
};

export const ReceivingEnhet = ({ selectedEnhet, setSelectedEnhet, enheter, error, oppgavebehandling }: Props) => {
  const { id, typeId, gosysOppgaveId } = oppgavebehandling;
  const [filter, setFilter] = useState('');
  const scoredEnheter = useMemo(() => enheter.map((enhet) => ({ ...enhet, score: 0 })), [enheter]);
  const [filteredEnheter, setFilteredEnheter] = useState(scoredEnheter);

  const filterAndSort = (value: string) => {
    const filtered = getFiltered(scoredEnheter, value);

    const sorted = filtered.toSorted((a, b) => b.score - a.score);

    setFilteredEnheter(sorted);

    if (sorted.length === 1) {
      return setSelectedEnhet(sorted[0]?.enhetsnr ?? null);
    }

    if (!sorted.some(({ enhetsnr }) => enhetsnr === selectedEnhet)) {
      setSelectedEnhet(null);
    }
  };

  return (
    <Container>
      <Fieldset>
        <Legend>Velg enhet som skal motta oppgaven</Legend>

        <Search
          style={{ width: 600 }}
          size="small"
          label="Filtrer på enhetsnavn eller enhetsnummer"
          placeholder="Filtrer på enhetsnavn eller enhetsnummer"
          value={filter}
          onChange={(value) => {
            setFilter(value);
            filterAndSort(value);
          }}
        />

        {filteredEnheter.length === 0 ? (
          <Empty>
            <Alert variant="info" size="small" inline>
              Ingen enheter funnet
            </Alert>
          </Empty>
        ) : (
          <List>
            {filteredEnheter.map((enhet) => (
              <SelectableListItem
                {...enhet}
                selected={selectedEnhet}
                setSelected={setSelectedEnhet}
                key={enhet.enhetsnr}
              />
            ))}
          </List>
        )}
        {error === null ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </Fieldset>

      <SuggestedEnhet
        selectedEnhet={selectedEnhet}
        setSelectedEnhet={setSelectedEnhet}
        id={id}
        typeId={typeId}
        gosysOppgaveId={gosysOppgaveId}
      />
    </Container>
  );
};

interface SelectButtonProps {
  enhetsnr: string;
  navn: string;
  selected: string | null;
  setSelected: (enhet: string | null) => void;
}

const SelectableListItem = ({ enhetsnr, navn, selected, setSelected }: SelectButtonProps) => {
  const ref = useRef<HTMLLIElement>(null);

  const isSelected = selected === enhetsnr;

  useEffect(() => {
    if (isSelected) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [isSelected]);

  const label = isSelected ? 'Fjern valgt enhet' : 'Velg enhet';

  const children = (
    <ListItem ref={ref} onClick={() => setSelected(isSelected ? null : enhetsnr)}>
      <StyledButton size="small" variant="tertiary" title={label} aria-label={label}>
        {isSelected ? <CheckmarkCircleFillIconColored aria-hidden fontSize={20} /> : 'Velg'}
      </StyledButton>
      {enhetsnr} - {navn}
    </ListItem>
  );

  if (isSelected) {
    return (
      <Tooltip content="Valgt enhet. Klikk igjen for å fjerne valg." placement="left">
        {children}
      </Tooltip>
    );
  }

  return children;
};

const StyledButton = styled(Button)`
  width: 45px;

  > span {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Legend = styled.legend`
  font-weight: bold;
  margin-bottom: var(--a-spacing-2);
`;

const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-1);
`;

const listStyle = css`
  height: 266px;
  overflow-y: scroll;
  overflow-x: auto;
  border: 1px solid var(--a-border-default);
  border-radius: var(--a-border-radius-medium);
  padding: var(--a-spacing-1);
`;

const Empty = styled.div`
  ${listStyle}
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex ;
  flex-direction: column;
  ${listStyle}
`;

const ListItem = styled.li`
  display: flex;
  gap: var(--a-spacing-2);
  align-items: center;
  cursor: pointer;

  &:hover {
    background-color: var(--a-surface-hover);
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-1);
`;
