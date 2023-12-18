import { Button } from '@navikt/ds-react';
import React, { useCallback, useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Direction } from '@app/components/deassign/direction';
import { PaaVentWarning } from '@app/components/deassign/paa-vent-warning';
import { Popup } from '@app/components/deassign/popup';
import { useFradel } from '@app/components/oppgavestyring/use-tildel';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { FradelReason, IOppgave } from '@app/types/oppgaver';

const KABAL_HEADER_HEIGHT = 48;

export const FradelButton = (props: IOppgave) => {
  const { tildeltSaksbehandlerident, medunderskriver, ytelseId, isAvsluttetAvSaksbehandler } = props;

  const [access, isAccessLoading] = useOppgaveActions(tildeltSaksbehandlerident, medunderskriver.navIdent, ytelseId);

  if (isAccessLoading || isAvsluttetAvSaksbehandler) {
    return null;
  }

  if (access.deassignSelf) {
    return <DeassignSelf {...props} />;
  }

  if (access.deassignOthers) {
    return <LederDeassign {...props} />;
  }

  return null;
};

const DeassignSelf = ({ id, typeId, ytelseId, sattPaaVent }: IOppgave): JSX.Element | null => {
  const [, { isLoading }] = useTildelSaksbehandlerMutation({ fixedCacheKey: id });
  const [paaVentWarningIsOpen, setPaaVentWarningIsOpen] = useState(false);
  const [reasonPopupDirection, setReasonPopupDirection] = useState<Direction | null>(null);
  const closePopup = useCallback(() => setReasonPopupDirection(null), []);
  const ref = useRef<HTMLDivElement>(null);

  useOnClickOutside(ref, closePopup);

  const onLeggTilbake = useCallback(() => {
    if (sattPaaVent !== null && !paaVentWarningIsOpen) {
      return setPaaVentWarningIsOpen(true);
    }

    if (reasonPopupDirection === null) {
      if (ref.current === null) {
        return;
      }

      const distance = ref.current.getBoundingClientRect().top - KABAL_HEADER_HEIGHT;

      setReasonPopupDirection(distance < 500 ? Direction.DOWN : Direction.UP);
    } else {
      closePopup();
    }
  }, [closePopup, paaVentWarningIsOpen, reasonPopupDirection, sattPaaVent]);

  const onConfirm = () => {
    setPaaVentWarningIsOpen(false);
    onLeggTilbake();
  };

  return (
    <Container ref={ref}>
      <StyledButton
        variant="secondary"
        type="button"
        size="small"
        onClick={onLeggTilbake}
        loading={isLoading}
        data-testid="behandling-fradel-button"
        data-klagebehandlingid={id}
      >
        Legg tilbake
      </StyledButton>

      <PaaVentWarning
        close={() => setPaaVentWarningIsOpen(false)}
        onConfirm={onConfirm}
        isOpen={paaVentWarningIsOpen}
      />

      {reasonPopupDirection !== null ? (
        <Popup direction={reasonPopupDirection} close={closePopup} oppgaveId={id} typeId={typeId} ytelseId={ytelseId} />
      ) : null}
    </Container>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
`;

const Container = styled.div`
  grid-area: fradel;
  position: relative;
`;

const LederDeassign = ({ id, typeId, ytelseId, sattPaaVent }: IOppgave): JSX.Element | null => {
  const [fradel, { isLoading }] = useFradel(id, typeId, ytelseId);
  const [paaVentWarningIsOpen, setPaaVentWarningIsOpen] = useState(false);

  const lederDeassign = useCallback(() => fradel({ reasonId: FradelReason.LEDER }), [fradel]);

  const onLeggTilbake = sattPaaVent === null ? lederDeassign : () => setPaaVentWarningIsOpen(true);

  return (
    <Container>
      <StyledButton
        variant="secondary"
        type="button"
        size="small"
        onClick={onLeggTilbake}
        loading={isLoading}
        disabled={isLoading}
        data-testid="behandling-fradel-button"
        data-klagebehandlingid={id}
      >
        Legg tilbake
      </StyledButton>
      <PaaVentWarning
        close={() => setPaaVentWarningIsOpen(false)}
        onConfirm={lederDeassign}
        isOpen={paaVentWarningIsOpen}
      />
    </Container>
  );
};
