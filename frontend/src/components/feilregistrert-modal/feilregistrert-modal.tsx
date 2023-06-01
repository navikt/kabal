import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Button, Heading, Loader, Modal } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { isoDateTimeToPretty } from '@app/domain/date';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFagsystemName } from '@app/hooks/use-fagsystem-name';

interface Props extends ContentProps {
  isOpen: boolean;
}

export const FeilregistrertModal = ({ isOpen, close }: Props) => (
  <Modal open={isOpen} aria-label="Feilregistrert oppgave" onClose={close}>
    <StyledModalContent>
      <Content close={close} />
    </StyledModalContent>
  </Modal>
);

interface ContentProps {
  close: () => void;
}

const Content = ({ close }: ContentProps) => {
  const { data: oppgave, isLoading } = useOppgave();
  const fagsystemName = useFagsystemName(oppgave?.feilregistrering?.fagsystemId);

  if (isLoading || typeof oppgave === 'undefined' || oppgave.feilregistrering === null) {
    return <Loader title="Laster..." />;
  }

  return (
    <>
      <Heading spacing level="1" size="large">
        Feilregistrert oppgave
      </Heading>

      <BodyShort spacing>
        <time dateTime={oppgave.feilregistrering.registered}>
          {isoDateTimeToPretty(oppgave.feilregistrering.registered)}
        </time>
      </BodyShort>
      <BodyShort>Feilregistrert av: {oppgave.feilregistrering.feilregistrertAv.navn}</BodyShort>
      <BodyShort spacing>Fagsystem: {fagsystemName}</BodyShort>
      <Heading level="2" size="small" spacing>
        Årsak
      </Heading>
      <StyledBodyLong spacing>{oppgave.feilregistrering.reason}</StyledBodyLong>
      <Button variant="primary" size="small" icon={<XMarkIcon aria-hidden />} onClick={close}>
        Lukk
      </Button>
    </>
  );
};

const StyledModalContent = styled(Modal.Content)`
  width: 800px;
  max-width: 100%;
`;

const StyledBodyLong = styled(BodyLong)`
  border-left: 6px solid var(--a-border-subtle);
  padding-left: 1rem;
`;
