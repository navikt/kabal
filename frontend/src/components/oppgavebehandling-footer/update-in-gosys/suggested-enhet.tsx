import { BodyShort, Button, HStack, Tag } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { CheckmarkCircleFillIconColored } from '@/components/colored-icons/colored-icons';
import { FAGSYSTEM_ARENA } from '@/components/oppgavebehandling-footer/fagsystem';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useGetGosysOppgaveQuery } from '@/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@/redux-api/search';
import { SaksTypeEnum, UtfallEnum } from '@/types/kodeverk';
import type { Enhet } from '@/types/oppgavebehandling/oppgavebehandling';

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
    typeId === SaksTypeEnum.OMGJØRINGSKRAV ||
    (typeId === SaksTypeEnum.ANKE && (utfallId === TRUKKET || utfallId === MEDHOLD || utfallId === OPPHEVET)) ||
    (typeId === SaksTypeEnum.KLAGE && oppgave.fagsystemId === FAGSYSTEM_ARENA);

  const { opprettetAvEnhet, tildeltEnhetsnr } = gosysOppgave;

  if (noSuggestion || opprettetAvEnhet === null) {
    return null;
  }

  const suggestedEnhet = getSuggestedEnhet(typeId, tildeltEnhetsnr, opprettetAvEnhet, enheter);

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
  typeId: SaksTypeEnum,
  tildeltEnhetsnr: string,
  opprettetAvEnhet: Enhet,
  enheter: Enhet[],
): Enhet => {
  if (!shouldSuggestTildeltEnhet(typeId)) {
    return opprettetAvEnhet;
  }

  const foundEnhet = enheter.find((enhet) => enhet.enhetsnr === tildeltEnhetsnr);

  if (foundEnhet !== undefined) {
    return foundEnhet;
  }

  return { enhetsnr: tildeltEnhetsnr, navn: 'Ukjent enhet' };
};

const shouldSuggestTildeltEnhet = (typeId: SaksTypeEnum): boolean =>
  typeId === SaksTypeEnum.ANKE || typeId === SaksTypeEnum.BEGJÆRING_OM_GJENOPPTAK;
