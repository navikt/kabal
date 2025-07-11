import { Confirm } from '@app/components/feilregistrering/confirm';
import { Feilregistrert } from '@app/components/feilregistrering/feilregistrert';
import { Register } from '@app/components/feilregistrering/register';
import { useCanFeilregistrere } from '@app/components/feilregistrering/use-can-feilregistrere';
import { useOnClickOutside } from '@app/hooks/use-on-click-outside';
import { useSetFeilregistrertMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { FileXMarkIcon } from '@navikt/aksel-icons';
import { Box, Button, VStack } from '@navikt/ds-react';
import { useRef, useState } from 'react';
import { Context } from './context';
import type { Children, OppgaveId, Position, Variant } from './types';

interface Props extends OppgaveId, Variant, Position {
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
    return <Feilregistrert feilregistrert={feilregistrert} />;
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
    <div className="relative inline-block" ref={ref}>
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
    </div>
  );
};

const FeilregistrerPanel = ({ oppgaveId, position, align }: OppgaveId & Position) => {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const isOver = position === 'over';
  const isLeft = align === 'left';

  return (
    <VStack
      asChild
      className={`z-1 ${isOver ? 'bottom-full' : 'top-full'} ${isLeft ? 'left-0' : 'right-0'}`}
      gap="4 0"
      minWidth="400px"
      position="absolute"
    >
      <Box background="bg-default" padding="4" shadow="medium" borderRadius="medium">
        {isConfirmed ? <Register oppgaveId={oppgaveId} /> : <Confirm setIsConfirmed={() => setIsConfirmed(true)} />}
      </Box>
    </VStack>
  );
};
