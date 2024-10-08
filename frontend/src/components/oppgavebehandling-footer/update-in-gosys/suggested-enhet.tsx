import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import type { Enhet } from '@app/types/oppgavebehandling/oppgavebehandling';
import { BodyShort, Button, Tag } from '@navikt/ds-react';
import { styled } from 'styled-components';

interface Props {
  suggestedEnhet: Enhet | null;
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
}

export const SuggestedEnhet = ({ suggestedEnhet, setSelectedEnhet, selectedEnhet }: Props) => {
  if (suggestedEnhet === null) {
    return null;
  }

  return (
    <Container>
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
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--a-spacing-1);
`;
