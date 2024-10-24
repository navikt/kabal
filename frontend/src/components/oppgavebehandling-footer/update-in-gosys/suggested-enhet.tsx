import { CheckmarkCircleFillIconColored } from '@app/components/colored-icons/colored-icons';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
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

const { TRUKKET, MEDHOLD, OPPHEVET } = UtfallEnum;

export const SuggestedEnhet = ({ setSelectedEnhet, selectedEnhet, id, typeId, gosysOppgaveId }: Props) => {
  const { data: gosysOppgave, isLoading } = useGetGosysOppgaveQuery(gosysOppgaveId === null ? skipToken : id);
  const { data: oppgave } = useOppgave();
  const { data: enheter = [] } = useSearchEnheterQuery({});

  if (oppgave === undefined || gosysOppgave === undefined) {
    return null;
  }

  const { utfallId } = oppgave.resultat;

  const noSuggestion =
    typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN ||
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET ||
    (typeId === SaksTypeEnum.ANKE && (utfallId === TRUKKET || utfallId === MEDHOLD || utfallId === OPPHEVET));

  const { opprettetAvEnhet, tildeltEnhetsnr } = gosysOppgave;

  if (noSuggestion || opprettetAvEnhet === null) {
    return null;
  }

  const suggestedEnhetsnr = typeId === SaksTypeEnum.ANKE ? tildeltEnhetsnr : opprettetAvEnhet?.enhetsnr;

  const suggestedEnhetName =
    typeId === SaksTypeEnum.ANKE
      ? (enheter.find((enhet) => enhet.enhetsnr === suggestedEnhetsnr)?.navn ?? 'Ukjent enhet')
      : opprettetAvEnhet.navn;

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
          {suggestedEnhetsnr} - {suggestedEnhetName}
        </Tag>
      </BodyShort>
      {suggestedEnhetsnr === selectedEnhet ? (
        <Button size="small" variant="tertiary-neutral" disabled icon={<CheckmarkCircleFillIconColored />}>
          Valgt
        </Button>
      ) : (
        <Button size="small" variant="tertiary" onClick={() => setSelectedEnhet(suggestedEnhetsnr)}>
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
