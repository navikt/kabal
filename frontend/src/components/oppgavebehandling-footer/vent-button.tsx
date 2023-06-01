import { HourglassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useDeleteSattPaaVentMutation, useSattPaaVentMutation } from '@app/redux-api/oppgaver/mutations/vent';

export const VentButton = () => {
  const { data, isLoading: oppgaveIsloading } = useOppgave();
  const [settPaavent, { isLoading: sattPaaVentIsLoading }] = useSattPaaVentMutation();
  const [deleteSettPaavent, { isLoading: deleteSattPaaVentIsLoading }] = useDeleteSattPaaVentMutation();

  if (oppgaveIsloading || typeof data === 'undefined' || data.feilregistrering !== null) {
    return null;
  }

  const isLoading = sattPaaVentIsLoading || deleteSattPaaVentIsLoading;

  if (typeof data.sattPaaVent === 'string') {
    return (
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => deleteSettPaavent(data.id)}
        loading={isLoading}
        icon={<XMarkIcon aria-hidden />}
      >
        Avslutt venteperiode
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      size="small"
      onClick={() => settPaavent(data.id)}
      loading={isLoading}
      icon={<HourglassIcon aria-hidden />}
    >
      Sett på vent
    </Button>
  );
};
