import { Alert, BodyShort, Button, ErrorMessage, Label, Radio, RadioGroup, Search, Tag } from '@navikt/ds-react';
import { useState } from 'react';
import { css, styled } from 'styled-components';
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
              setNumber(value);
              filter({ numberSearch: value });
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
            {filteredEnheter.map(({ enhetsnr, navn }) => (
              <Radio value={enhetsnr} key={enhetsnr}>
                {enhetsnr} - {navn}
              </Radio>
            ))}
          </StyledRadioGroup>
        )}
        {error === null ? null : <ErrorMessage size="small">{error}</ErrorMessage>}
      </Fieldset>

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
  height: 260px;
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

const SuggestedEnhet = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
