import { HourglassIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { SettPaaVentPanel } from '@app/components/oppgavebehandling-footer/sett-paa-vent/panel';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useDeleteSattPaaVentMutation } from '@app/redux-api/oppgaver/mutations/vent';

export const VentButton = () => {
  const [showPopup, setShowPopup] = useState(false);
  const { data, isLoading: oppgaveIsloading } = useOppgave();
  const [deleteSettPaavent, { isLoading: deleteSattPaaVentIsLoading }] = useDeleteSattPaaVentMutation();
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setShowPopup(false));

  if (oppgaveIsloading || typeof data === 'undefined' || data.feilregistrering !== null) {
    return null;
  }

  const isLoading = deleteSattPaaVentIsLoading;

  if (typeof data.sattPaaVent === 'string') {
    return (
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => {
          setShowPopup(false);
          deleteSettPaavent(data.id);
        }}
        loading={isLoading}
        icon={<XMarkIcon aria-hidden />}
      >
        Avslutt venteperiode
      </Button>
    );
  }

  return (
    <Container ref={ref}>
      {showPopup ? <SettPaaVentPanel oppgaveId={data.id} close={() => setShowPopup(false)} /> : null}
      <Button
        type="button"
        variant="secondary"
        size="small"
        onClick={() => setShowPopup(!showPopup)}
        loading={isLoading}
        icon={<HourglassIcon aria-hidden />}
      >
        Sett på vent
      </Button>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;
