import { SuggestedEnhet } from '@app/components/oppgavebehandling-footer/update-in-gosys/suggested-enhet';
import { fuzzySearch } from '@app/components/smart-editor/gode-formuleringer/fuzzy-search';
import { splitQuery } from '@app/components/smart-editor/gode-formuleringer/split-query';
import { SaksTypeEnum } from '@app/types/kodeverk';
import type { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, ErrorMessage, Radio, RadioGroup, Search } from '@navikt/ds-react';
import { useEffect, useRef, useState } from 'react';
import { css, styled } from 'styled-components';

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

const getFilteredByNumber = (enheter: ScoredEnhet[], number: string): ScoredEnhet[] => {
  if (number.length === 0) {
    return enheter;
  }

  const filteredByNumber: ScoredEnhet[] = [];

  for (const enhet of enheter) {
    if (enhet.enhetsnr.startsWith(number)) {
      filteredByNumber.push({ ...enhet, score: 100 });
    } else if (enhet.enhetsnr.includes(number)) {
      filteredByNumber.push({ ...enhet, score: 50 });
    }
  }

  return filteredByNumber;
};

const getFilteredByName = (enheter: ScoredEnhet[], name: string): ScoredEnhet[] => {
  if (name.length === 0) {
    return enheter;
  }

  const filteredByName: ScoredEnhet[] = [];
  const nameQuery = splitQuery(name);

  for (const enhet of enheter) {
    const score = fuzzySearch(nameQuery, enhet.navn);

    if (score > 0) {
      filteredByName.push({ ...enhet, score: score + enhet.score });
    }
  }

  return filteredByName;
};

export const ReceivingEnhet = ({ selectedEnhet, setSelectedEnhet, enheter, error, oppgavebehandling }: Props) => {
  const { typeId, oppgave } = oppgavebehandling;
  const suggestedEnhet = typeId === SaksTypeEnum.KLAGE ? (oppgave?.opprettetAv ?? null) : null;
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const scoredEnheter = enheter.map((enhet) => ({ ...enhet, score: 0 }));
  const [filteredEnheter, setFilteredEnheter] = useState(scoredEnheter);

  const filter = ({ nameSearch, numberSearch }: { nameSearch?: string; numberSearch?: string }) => {
    const nameFilter = (nameSearch ?? name).toLowerCase();
    const numberFilter = (numberSearch ?? number).toLowerCase();

    const filteredByNumber = getFilteredByNumber(scoredEnheter, numberFilter);
    const filteredByName = getFilteredByName(filteredByNumber, nameFilter);

    const sorted = filteredByName.toSorted((a, b) => b.score - a.score);

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

        <SearchFields>
          <Search
            size="small"
            label="Filtrer på enhetsnavn"
            placeholder="Filtrer på enhetsnavn"
            value={name}
            onChange={(value) => {
              setName(value);
              filter({ nameSearch: value });
            }}
          />

          <Search
            size="small"
            label="Filtrer på enhetsnummer"
            placeholder="Filtrer på enhetsnummer"
            value={number}
            onChange={(value) => {
              const onlyNumbers = value.replace(/[^0-9]/g, '');
              setNumber(onlyNumbers);
              filter({ numberSearch: onlyNumbers });
            }}
          />
        </SearchFields>

        {filteredEnheter.length === 0 ? (
          <Empty>
            <Alert variant="info" size="small" inline>
              Ingen enheter funnet
            </Alert>
          </Empty>
        ) : (
          <StyledRadioGroup value={selectedEnhet} onChange={setSelectedEnhet} legend="Enhet" hideLegend size="small">
            {filteredEnheter.map((enhet) => (
              <RadioButton {...enhet} selected={selectedEnhet} key={enhet.enhetsnr} />
            ))}
          </StyledRadioGroup>
        )}
        {error === null ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </Fieldset>

      <SuggestedEnhet
        suggestedEnhet={suggestedEnhet}
        selectedEnhet={selectedEnhet}
        setSelectedEnhet={setSelectedEnhet}
      />
    </Container>
  );
};

const RadioButton = ({ enhetsnr, navn, selected }: Enhet & { selected: string | null }) => {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (enhetsnr === selected) {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [enhetsnr, selected]);

  return (
    <Radio value={enhetsnr} ref={ref}>
      {enhetsnr} - {navn}
    </Radio>
  );
};

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

const radioGroupStyle = css`
  height: 266px;
  overflow-y: scroll;
  overflow-x: auto;
  border: 1px solid var(--a-border-default);
  border-radius: var(--a-border-radius-medium);
  padding: var(--a-spacing-1);
`;

const Empty = styled.div`
  ${radioGroupStyle}
`;

const StyledRadioGroup = styled(RadioGroup)`
  ${radioGroupStyle}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-1);
`;

const SearchFields = styled.div`
  display: grid;
  gap: var(--a-spacing-2);
  grid-template-columns: 360px 260px;
`;
