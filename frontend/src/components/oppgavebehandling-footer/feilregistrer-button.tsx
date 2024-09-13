import { FeilregistrertModal } from '@app/components/feilregistrert-modal/feilregistrert-modal';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { InformationSquareIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { useState } from 'react';
import { Feilregistrering } from '../feilregistrering/feilregistrering';

export const FeilregistrerButton = () => {
  const { data: oppgave } = useOppgave();

  if (typeof oppgave === 'undefined' || oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    return null;
  }

  if (oppgave.feilregistrering === null) {
    return (
      <Feilregistrering
        oppgaveId={oppgave.id}
        fagsystemId={oppgave.fagsystemId}
        tildeltSaksbehandlerident={oppgave.saksbehandler?.navIdent ?? null}
        variant="secondary"
        $position="over"
        $align="left"
        feilregistrert={null}
      />
    );
  }

  return <Feilregistrert />;
};

const Feilregistrert = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button
        onClick={() => setIsOpen((o) => !o)}
        variant="primary"
        size="small"
        icon={<InformationSquareIcon aria-hidden />}
      >
        Vis informasjon om feilregistrering
      </Button>
      <FeilregistrertModal isOpen={isOpen} close={() => setIsOpen(false)} />
    </>
  );
};
