import { ISO_DATETIME_FORMAT } from '@app/components/date-picker/constants';
import { Direction } from '@app/components/deassign/direction';
import { PaaVentWarning } from '@app/components/deassign/paa-vent-warning';
import { Popup } from '@app/components/deassign/popup';
import { useFradel } from '@app/components/oppgavestyring/use-tildel';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useOppgaveActions } from '@app/hooks/use-oppgave-actions';
import { useTildelSaksbehandlerMutation } from '@app/redux-api/oppgaver/mutations/tildeling';
import { SaksTypeEnum } from '@app/types/kodeverk';
import { FradelReason, type IOppgave } from '@app/types/oppgaver';
import { Button, HStack } from '@navikt/ds-react';
import { differenceInSeconds, parse } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-components';

const KABAL_HEADER_HEIGHT = 48;
const UNDO_TIMEOUT_SECONDS = 10;

export const FradelButton = (props: IOppgave) => {
  const {
    id,
    typeId,
    tildeltSaksbehandlerident,
    medunderskriver,
    ytelseId,
    isAvsluttetAvSaksbehandler,
    rol,
    tildeltTimestamp,
  } = props;

  const [fradel, { isLoading }] = useFradel(id, typeId, ytelseId);

  const [undoSecondsLeft, setUndoSecondsLeft] = useState(0);

  useEffect(() => {
    if (tildeltSaksbehandlerident === null || tildeltTimestamp === undefined) {
      return;
    }

    const parsed = parse(tildeltTimestamp, ISO_DATETIME_FORMAT, new Date());
    const diff = differenceInSeconds(new Date(), parsed);

    setUndoSecondsLeft(diff >= UNDO_TIMEOUT_SECONDS ? 0 : UNDO_TIMEOUT_SECONDS - diff);
  }, [tildeltSaksbehandlerident, tildeltTimestamp]);

  const undoInterval = useRef<Timer | null>(null);

  useEffect(() => {
    undoInterval.current = setInterval(() => setUndoSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1)), 1_000);

    return () => {
      if (undoInterval.current !== null) {
        clearInterval(undoInterval.current);
      }
    };
  }, []);

  const [access, isAccessLoading] = useOppgaveActions(
    tildeltSaksbehandlerident,
    medunderskriver.employee?.navIdent ?? null,
    medunderskriver.flowState,
    rol.flowState,
    ytelseId,
  );

  if (isAccessLoading || isAvsluttetAvSaksbehandler || typeId === SaksTypeEnum.BEHANDLING_ETTER_TR_OPPHEVET) {
    return null;
  }

  if (tildeltSaksbehandlerident !== null && undoSecondsLeft > 0) {
    return (
      <StyledButton
        variant="secondary"
        size="small"
        loading={isLoading}
        onClick={async () => {
          await fradel({ reasonId: FradelReason.ANGRET });
          setUndoSecondsLeft(0);

          if (undoInterval.current !== null) {
            clearInterval(undoInterval.current);
          }
        }}
      >
        Angre ({undoSecondsLeft})
      </StyledButton>
    );
  }

  if (access.deassignSelf || access.deassignOthers) {
    return <Deassign {...props} />;
  }

  return null;
};

const Deassign = ({ id, typeId, ytelseId, sattPaaVent, hjemmelIdList }: IOppgave): JSX.Element | null => {
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
    <HStack position="relative" gridColumn="tildel" ref={ref}>
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
        <Popup
          direction={reasonPopupDirection}
          close={closePopup}
          oppgaveId={id}
          typeId={typeId}
          ytelseId={ytelseId}
          hjemmelIdList={hjemmelIdList}
        />
      ) : null}
    </HStack>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
`;
