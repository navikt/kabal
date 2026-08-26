import { BodyShort, Button, HStack, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useContext } from 'react';
import { StaticDataContext } from '@/components/app/static-data-context';
import { CheckmarkCircleFillIconColored } from '@/components/colored-icons/colored-icons';
import { FAGSYSTEM_INFOTRYGD } from '@/components/oppgavebehandling-footer/fagsystem';
import { useIsAnkeOrGbWithUtfallToTr } from '@/components/oppgavebehandling-footer/update-in-gosys/use-is-anke-or-gb-with-utfall-to-tr';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@/redux-api/search';
import type { IEnhet } from '@/types/bruker';
import { SaksTypeEnum } from '@/types/kodeverk';
import type { Enhet } from '@/types/oppgavebehandling/oppgavebehandling';

interface Props {
  id: string;
  typeId: SaksTypeEnum;
  gosysOppgaveId: number | null;
  selectedEnhet: string | null;
  setSelectedEnhet: (enhet: string | null) => void;
}

export const SuggestedEnhet = ({ setSelectedEnhet, selectedEnhet, id, typeId, gosysOppgaveId }: Props) => {
  const { data: gosysOppgave, isLoading } = useGetGosysOppgaveQuery(gosysOppgaveId === null ? skipToken : id);
  const { data: oppgave } = useOppgave();
  const { data: enheter = [] } = useSearchEnheterQuery({});
  const suggestOwnEnhet = useIsAnkeOrGbWithUtfallToTr();
  const {
    user: { ansattEnhet },
  } = useContext(StaticDataContext);

  if (oppgave === undefined || gosysOppgave === undefined) {
    return null;
  }

  const shouldSuggest =
    suggestOwnEnhet || (typeId === SaksTypeEnum.KLAGE && oppgave.fagsystemId === FAGSYSTEM_INFOTRYGD);

  const { tildeltEnhetsnr } = gosysOppgave;

  if (!shouldSuggest) {
    return null;
  }

  const suggestedEnhet = getSuggestedEnhet(suggestOwnEnhet, ansattEnhet, tildeltEnhetsnr, enheter);

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

const getSuggestedEnhet = (
  suggestOwnEnhet: boolean,
  ansattEnhet: IEnhet,
  tildeltEnhetsnr: string,
  enheter: Enhet[],
): Enhet => {
  if (suggestOwnEnhet) {
    return { enhetsnr: ansattEnhet.id, navn: ansattEnhet.navn };
  }

  const tildeltenhet = enheter.find((enhet) => enhet.enhetsnr === tildeltEnhetsnr);

  return { enhetsnr: tildeltEnhetsnr, navn: tildeltenhet?.navn ?? 'Ukjent enhet' };
};
