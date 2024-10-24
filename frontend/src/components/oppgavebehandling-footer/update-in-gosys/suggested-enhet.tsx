import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { BodyShort, Button, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { styled } from 'styled-components';

interface Props {
  id: string;
  typeId: SaksTypeEnum;
  gosysOppgaveId: number | null;
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
}

export const SuggestedEnhet = ({ setSelectedEnhet, selectedEnhet, id, typeId, gosysOppgaveId }: Props) => {
  const { data: gosysOppgave, isLoading } = useGetGosysOppgaveQuery(gosysOppgaveId === null ? skipToken : id);

  if (typeId !== SaksTypeEnum.KLAGE) {
    return null;
  }

  const suggestedEnhet = gosysOppgave?.opprettetAvEnhet ?? null;

  if (suggestedEnhet === null) {
    return null;
  }

  if (isLoading) {
    return (
      <Container>
        <BodyShort size="small">
          <b>Foreslått enhet som skal motta oppgaven:</b>{' '}
          <Tag size="small" variant="alt1">
            Laster...
          </Tag>
        </BodyShort>
        <Button size="small" variant="tertiary-neutral" loading>
          Valgt
        </Button>
      </Container>
    );
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
