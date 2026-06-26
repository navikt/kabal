import { InlineMessage } from '@navikt/ds-react';
import { getTitleLowercase } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { useIsFakeArenaCase } from '@/components/behandling/behandlingsdialog/medunderskriver/helpers';
import { useIsAssignedMedunderskriverAndSent } from '@/hooks/use-is-medunderskriver';
import { useIsTildeltSaksbehandler } from '@/hooks/use-is-saksbehandler';
import { SaksTypeEnum } from '@/types/kodeverk';

interface Props {
  typeId: SaksTypeEnum;
}

export const ArenaInfoMu = ({ typeId }: Props) => {
  const isMedunderskriverAndSent = useIsAssignedMedunderskriverAndSent();
  const isFakeArenaCase = useIsFakeArenaCase();

  if (!isFakeArenaCase || !isMedunderskriverAndSent) {
    return null;
  }

  if (
    typeId === SaksTypeEnum.KLAGE ||
    typeId === SaksTypeEnum.ANKE ||
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET
  ) {
    return (
      <InlineMessage status="info" size="small">
        Når du er klar til å returnere saken til saksbehandler i Kabal som godkjent, skal du samtidig beslutte saken i
        Arena og avslutte oppgaven i Arena. Dersom Arena har opprettet en Oppretthold anke-oppgave, kan du avslutte
        denne.
      </InlineMessage>
    );
  }

  return null;
};

export const ArenaInfoSaksbehandler = ({ typeId }: Props) => {
  const isSaksbehandler = useIsTildeltSaksbehandler();
  const isFakeArenaCase = useIsFakeArenaCase();

  if (!isFakeArenaCase || !isSaksbehandler) {
    return null;
  }

  if (
    typeId === SaksTypeEnum.KLAGE ||
    typeId === SaksTypeEnum.ANKE ||
    typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET
  ) {
    return (
      <InlineMessage status="info" size="small">
        Når du er klar til å sende saken til {getTitleLowercase(typeId)} i Kabal, skal du samtidig sende saken til
        beslutning i Arena.
      </InlineMessage>
    );
  }
};
