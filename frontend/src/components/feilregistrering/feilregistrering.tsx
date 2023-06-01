import { FileXMarkIcon } from '@navikt/aksel-icons';
import { Button, Panel } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { Confirm } from '@app/components/feilregistrering/confirm';
import { Register } from '@app/components/feilregistrering/register';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useSetFeilregistrertMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { Context } from './context';
import { Children, FagsystemId, OppgaveId, Position, Variant } from './types';

interface Props extends OppgaveId, Variant, Position, FagsystemId {
  feilregistrert: string | null;
}

export const Feilregistrering = ({ $position, oppgaveId, variant, feilregistrert, fagsystemId }: Props) => {
  if (feilregistrert !== null) {
    return <time dateTime={feilregistrert}>{isoDateTimeToPretty(feilregistrert)}</time>;
  }

  return (
    <FeilregistrerButton variant={variant} oppgaveId={oppgaveId} isFeilregistrert={false}>
      <FeilregistrerPanel oppgaveId={oppgaveId} $position={$position} fagsystemId={fagsystemId} />
    </FeilregistrerButton>
  );
};

interface State {
  isFeilregistrert: boolean;
}

const FeilregistrerButton = ({
  oppgaveId,
  children,
  variant,
  isFeilregistrert,
}: OppgaveId & Children & Variant & State) => {
  const [isOpen, setIsOpen] = useState(isFeilregistrert);
  const [, { isLoading }] = useSetFeilregistrertMutation({ fixedCacheKey: oppgaveId });
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, () => setIsOpen(false));

  return (
    <Container ref={ref}>
      <Button
        variant={variant}
        size="small"
        onClick={() => setIsOpen((o) => !o)}
        loading={isLoading}
        icon={<FileXMarkIcon aria-hidden />}
      >
        Feilregistrer
      </Button>
      <Context.Provider value={{ isOpen, close: () => setIsOpen(false) }}>{isOpen ? children : null}</Context.Provider>
    </Container>
  );
};

const FeilregistrerPanel = ({ oppgaveId, $position, fagsystemId }: OppgaveId & Position & FagsystemId) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <FloatingPanel $position={$position}>
      {isConfirmed ? (
        <Register oppgaveId={oppgaveId} />
      ) : (
        <Confirm fagsystemId={fagsystemId} setIsConfirmed={() => setIsConfirmed(true)} />
      )}
    </FloatingPanel>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const FloatingPanel = styled(Panel)<Position>`
  position: absolute;
  top: ${({ $position }) => ($position === 'over' ? 'auto' : '100%')};
  bottom: ${({ $position }) => ($position === 'over' ? '100%' : 'auto')};
  right: 0;
  display: flex;
  flex-direction: column;
  row-gap: 16px;
  z-index: 1;
  border-radius: 4px;
  min-width: 400px;
  box-shadow: 0px 4px 4px rgb(0, 0, 0, 0.25);
`;
