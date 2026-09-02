import { BodyShort, Button, HStack, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { CheckmarkCircleFillIconColored } from '@/components/colored-icons/colored-icons';
import { FAGSYSTEM_INFOTRYGD } from '@/components/oppgavebehandling-footer/fagsystem';
import { useIsAnkeOrGbWithUtfallToTr } from '@/components/oppgavebehandling-footer/update-in-gosys/use-is-anke-or-gb-with-utfall-to-tr';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { SaksTypeEnum } from '@/types/kodeverk';

interface Props {
  id: string;
  typeId: SaksTypeEnum;
  gosysOppgaveId: number | null;
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
}

export const SuggestedEnhet = ({ setSelectedEnhet, selectedEnhet, id, typeId, gosysOppgaveId }: Props) => {
  const {
    data: gosysOppgave,
    isLoading,
    isSuccess: gosysOppgaveIsSuccess,
  } = useGetGosysOppgaveQuery(gosysOppgaveId === null ? skipToken : id);
  const { data: oppgave, isSuccess: oppgaveIsSuccess } = useOppgave();
  const suggestOwnEnhet = useIsAnkeOrGbWithUtfallToTr();

  const {
    user: { ansattEnhet },
  } = useContext(StaticDataContext);

  if (isLoading) {
    return (
      <HStack align="center" gap="space-4">
        <BodyShort size="small">
          <b>Foreslått enhet som skal motta oppgaven:</b>{' '}
          <Tag data-color="meta-purple" size="small" variant="outline">
            Laster...
          </Tag>
        </BodyShort>
        <Button data-color="neutral" size="small" variant="tertiary" loading>
          Valgt
        </Button>
      </HStack>
    );
  }

  if (!oppgaveIsSuccess || !gosysOppgaveIsSuccess) {
    return null;
  }

  const suggestOpprettetAvEnhet = typeId === SaksTypeEnum.KLAGE && oppgave.fagsystemId === FAGSYSTEM_INFOTRYGD;

  const shouldSuggest = suggestOwnEnhet || suggestOpprettetAvEnhet;

  const { opprettetAvEnhet } = gosysOppgave;

  if (!shouldSuggest) {
    return null;
  }

  const suggestedEnhet = suggestOwnEnhet ? { enhetsnr: ansattEnhet.id, navn: ansattEnhet.navn } : opprettetAvEnhet;

  if (suggestedEnhet === null) {
    return null;
  }

  return (
    <HStack align="center" gap="space-4">
      <BodyShort size="small">
        <b>Foreslått enhet som skal motta oppgaven:</b>{' '}
        <Tag data-color="meta-purple" size="small" variant="outline">
          {suggestedEnhet.enhetsnr} - {suggestedEnhet.navn}
        </Tag>
      </BodyShort>
      {suggestedEnhet.enhetsnr === selectedEnhet ? (
        <Button data-color="neutral" size="small" variant="tertiary" disabled icon={<CheckmarkCircleFillIconColored />}>
          Valgt
        </Button>
      ) : (
        <Button
          data-color="neutral"
          size="small"
          variant="tertiary"
          onClick={() => setSelectedEnhet(suggestedEnhet.enhetsnr)}
        >
          Velg
        </Button>
      )}
    </HStack>
  );
};
