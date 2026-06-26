import { Label } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { FortroligWarning } from '@/components/behandling/behandlingsdialog/fortrolig-warning';
import {
  ArenaInfoMu,
  ArenaInfoSaksbehandler,
} from '@/components/behandling/behandlingsdialog/medunderskriver/arena-info';
import { getTitleCapitalized } from '@/components/behandling/behandlingsdialog/medunderskriver/get-title';
import { MedunderskriverReadOnly } from '@/components/behandling/behandlingsdialog/medunderskriver/read-only';
import { SelectMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/select-medunderskriver';
import { SendToMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/send-to-medunderskriver';
import { SendToSaksbehandler } from '@/components/behandling/behandlingsdialog/medunderskriver/send-to-saksbehandler';
import { SKELETON } from '@/components/behandling/behandlingsdialog/medunderskriver/skeleton';
import { MedunderskriverStateText } from '@/components/behandling/behandlingsdialog/medunderskriver/state-text';
import { TakeFromMedunderskriver } from '@/components/behandling/behandlingsdialog/medunderskriver/take-from-medunderskriver';
import { PartBox } from '@/components/behandling/styled-components';
import { hasFortroligFamily, hasFortroligStatus } from '@/domain/is-fortrolig';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useOppgaveId } from '@/hooks/oppgavebehandling/use-oppgave-id';
import { useIsFeilregistrert } from '@/hooks/use-is-feilregistrert';
import { useIsFullfoert } from '@/hooks/use-is-fullfoert';

export const Medunderskriver = () => {
  const oppgaveId = useOppgaveId();
  const { data: oppgave, isLoading: oppgaveIsLoading } = useOppgave();
  const isFinished = useIsFullfoert();
  const isFeilregistrert = useIsFeilregistrert();

  if (oppgaveIsLoading || oppgave === undefined || oppgaveId === skipToken) {
    return SKELETON;
  }

  const { typeId, medunderskriver } = oppgave;

  const isReadOnly = isFinished || isFeilregistrert;

  if (isReadOnly) {
    if (medunderskriver.employee === null) {
      return null;
    }

    return (
      <PartBox>
        <MedunderskriverReadOnly typeId={typeId} medunderskriver={medunderskriver} />
      </PartBox>
    );
  }

  if (hasFortroligStatus(oppgave.sakenGjelder.statusList)) {
    return <Warning />;
  }

  if (hasFortroligFamily(oppgave.sakenGjelder)) {
    return <Warning family />;
  }

  return (
    <PartBox>
      <Label size="small">{getTitleCapitalized(typeId)}</Label>
      <ArenaInfoSaksbehandler typeId={typeId} />
      <SelectMedunderskriver
        id={oppgaveId}
        medunderskriver={oppgave.medunderskriver}
        utfallId={oppgave.resultat.utfallId}
        typeId={typeId}
      />
      <MedunderskriverStateText medunderskriver={medunderskriver} typeId={typeId} />

      <SendToMedunderskriver oppgaveId={oppgaveId} medunderskriver={medunderskriver} typeId={typeId} />
      <TakeFromMedunderskriver oppgaveId={oppgaveId} medunderskriver={medunderskriver} typeId={typeId} />

      <SendToSaksbehandler oppgaveId={oppgaveId} medunderskriver={medunderskriver} />
      <ArenaInfoMu typeId={typeId} />
    </PartBox>
  );
};

interface WarningProps {
  family?: boolean;
}

const Warning = ({ family = false }: WarningProps) => (
  <FortroligWarning heading="Medunderskriver">
    Du kan ikke sende til medunderskriver fordi saken gjelder en bruker med fortrolig adresse
    {family ? ' (familieforhold)' : ''}.
  </FortroligWarning>
);
