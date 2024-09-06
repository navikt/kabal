import { FileXMarkIcon } from '@navikt/aksel-icons';
import { Box, Button } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { styled } from 'styled-components';
import { Confirm } from '@app/components/feilregistrering/confirm';
import { Register } from '@app/components/feilregistrering/register';
import { useCanFeilregistrere } from '@app/components/feilregistrering/use-can-feilregistrere';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useSetFeilregistrertMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { Context } from './context';
import { Children, FagsystemId, OppgaveId, Position, Variant } from './types';

interface Props extends OppgaveId, Variant, Position, FagsystemId {
  feilregistrert: string | null;
  tildeltSaksbehandlerident: string | null;
}

export const Feilregistrering = ({
  oppgaveId,
  variant,
  feilregistrert,
  tildeltSaksbehandlerident,
  ...props
}: Props) => {
  const canFeilregistrere = useCanFeilregistrere(tildeltSaksbehandlerident);

  if (feilregistrert !== null) {
    return <time dateTime={feilregistrert}>{isoDateTimeToPretty(feilregistrert)}</time>;
  }

  if (!canFeilregistrere) {
    return null;
  }

  return (
    <FeilregistrerButton variant={variant} oppgaveId={oppgaveId} isFeilregistrert={false}>
      <FeilregistrerPanel oppgaveId={oppgaveId} {...props} />
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

const FeilregistrerPanel = ({ oppgaveId, $position, $align, fagsystemId }: OppgaveId & Position & FagsystemId) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  return (
    <FloatingBox
      $position={$position}
      $align={$align}
      background="bg-default"
      padding="4"
      shadow="medium"
      borderRadius="medium"
    >
      {isConfirmed ? (
        <Register oppgaveId={oppgaveId} />
      ) : (
        <Confirm fagsystemId={fagsystemId} setIsConfirmed={() => setIsConfirmed(true)} />
      )}
    </FloatingBox>
  );
};

const Container = styled.div`
  position: relative;
  display: inline-block;
`;

const FloatingBox = styled(Box)<Position>`
  position: absolute;
  top: ${({ $position }) => ($position === 'over' ? 'auto' : '100%')};
  bottom: ${({ $position }) => ($position === 'over' ? '100%' : 'auto')};
  right: ${({ $align }) => ($align === 'left' ? 'auto' : '0')};
  left: ${({ $align }) => ($align === 'left' ? '0' : 'auto')};
  display: flex;
  flex-direction: column;
  row-gap: var(--a-spacing-4);
  z-index: 1;
  min-width: 400px;
`;
