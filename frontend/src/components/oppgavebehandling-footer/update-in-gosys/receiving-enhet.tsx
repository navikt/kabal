import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { SuggestedEnhet } from '@app/components/oppgavebehandling-footer/update-in-gosys/suggested-enhet';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import type { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, BoxNew, Button, ErrorMessage, HStack, Search, Tooltip, VStack } from '@navikt/ds-react';
import { useEffect, useMemo, useRef, useState } from 'react';

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
    <VStack gap="1">
      <SuggestedEnhet
        selectedEnhet={selectedEnhet}
        setSelectedEnhet={setSelectedEnhet}
        id={id}
        typeId={typeId}
        gosysOppgaveId={gosysOppgaveId}
      />
      <VStack as="fieldset" gap="1">
        <legend className="mb-2 font-bold">Velg enhet som skal motta oppgaven</legend>

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
          <Container>
            <Alert variant="info" size="small" inline>
              Ingen enheter funnet
            </Alert>
          </Container>
        ) : (
          <Container>
            <VStack as="ul">
              {filteredEnheter.map((enhet) => (
                <SelectableListItem
                  {...enhet}
                  selected={selectedEnhet}
                  setSelected={setSelectedEnhet}
                  key={enhet.enhetsnr}
                />
              ))}
            </VStack>
          </Container>
        )}
        {error === null ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </VStack>
    </VStack>
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
    <HStack
      as="li"
      gap="2"
      align="center"
      ref={ref}
      onClick={() => setSelected(isSelected ? null : enhetsnr)}
      className="cursor-pointer hover:bg-ax-bg-accent-moderate"
    >
      <Button size="small" variant="tertiary" title={label} aria-label={label} className="w-12">
        <HStack align="center" justify="center">
          {isSelected ? <CheckmarkCircleFillIconColored aria-hidden fontSize={20} /> : 'Velg'}
        </HStack>
      </Button>
      {enhetsnr} - {navn}
    </HStack>
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

interface EmptyProps {
  children: React.ReactElement;
}

const Container = ({ children }: EmptyProps) => (
  <BoxNew
    asChild
    height="202px"
    overflowY="scroll"
    overflowX="auto"
    borderWidth="1"
    borderColor="neutral"
    borderRadius="medium"
    padding="1"
  >
    {children}
  </BoxNew>
);
