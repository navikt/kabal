import { BodyShort, Button, ErrorMessage, Search, Select, Tag } from '@navikt/ds-react';
import { useState } from 'react';
import { styled } from 'styled-components';
import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

interface Props {
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
  error: string | null;
  enheter: Enhet[];
  oppgavebehandling: IOppgavebehandling;
}

export const EnhetSearch = ({ selectedEnhet, setSelectedEnhet, enheter, error, oppgavebehandling }: Props) => {
  const { typeId, oppgave } = oppgavebehandling;
  const suggestedEnhet = typeId === SaksTypeEnum.KLAGE ? (oppgave?.opprettetAv ?? null) : null;
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [filteredEnheter, setFilteredEnheter] = useState(
    enheter.toSorted((a, b) => a.enhetsnr.localeCompare(b.enhetsnr)),
  );

  const filter = ({ nameSearch, numberSearch }: { nameSearch?: string; numberSearch?: string }) => {
    const nameFilter = (nameSearch ?? name).toLowerCase();
    const numberFilter = (numberSearch ?? number).toLowerCase();

    const filtered = enheter
      .filter(
        ({ enhetsnr, navn }) =>
          (name.length > 0 ? navn.toLowerCase().includes(nameFilter) : true) &&
          (number.length > 0 ? enhetsnr.toLowerCase().includes(numberFilter) : true),
      )
      .toSorted((a, b) => a.enhetsnr.localeCompare(b.enhetsnr));

    setFilteredEnheter(filtered);

    if (filtered.length === 1) {
      return setSelectedEnhet(filtered[0]!.enhetsnr);
    }

    if (!filtered.some(({ enhetsnr }) => enhetsnr === selectedEnhet)) {
      setSelectedEnhet(null);
    }
  };

  return (
    <Container>
      <Line>
        <Select
          label="Velg enhet som skal motta oppgaven"
          size="small"
          value={selectedEnhet ?? NONE}
          onChange={({ target }) => setSelectedEnhet(target.value === NONE ? null : target.value)}
        >
          {selectedEnhet === null ? (
            <option value={NONE} disabled>
              Ikke valgt
            </option>
          ) : null}

          {filteredEnheter.map(({ enhetsnr, navn }) => (
            <option key={enhetsnr} value={enhetsnr}>
              {enhetsnr} - {navn}
            </option>
          ))}
        </Select>

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
            setNumber(value);
            filter({ numberSearch: value });
          }}
        />
      </Line>
      {error === null ? null : <ErrorMessage size="small">{error}</ErrorMessage>}

      {suggestedEnhet === null ? null : (
        <SuggestedEnhet>
          <BodyShort size="small">
            <b>Foreslått enhet som skal motta oppgaven:</b>{' '}
            <Tag size="small" variant="alt1">
              {suggestedEnhet.enhetsnr} - {suggestedEnhet.navn}
            </Tag>
          </BodyShort>
          {suggestedEnhet.enhetsnr === selectedEnhet ? (
            <Button size="small" variant="tertiary-neutral" disabled icon={<CheckmarkCircleFillIconColored />}>
              Valgt
            </Button>
          ) : (
            <Button size="small" variant="tertiary" onClick={() => setSelectedEnhet(suggestedEnhet.enhetsnr)}>
              Velg
            </Button>
          )}
        </SuggestedEnhet>
      )}
    </Container>
  );
};

const NONE = 'NONE';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Line = styled.div`
  display: grid;
  align-items: flex-end;
  gap: 1rem;
  grid-template-columns: auto 256px 256px;
`;

const SuggestedEnhet = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
  margin-top: var(--a-spacing-2);
`;
