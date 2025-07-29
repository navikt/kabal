import { isoDateTimeToPretty } from '@app/domain/date';
import { formatEmployeeName } from '@app/domain/employee-name';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFagsystemName } from '@app/hooks/use-fagsystem-name';
import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Button, Heading, Loader, Modal } from '@navikt/ds-react';

interface Props extends ContentProps {
  isOpen: boolean;
}

export const FeilregistrertModal = ({ isOpen, close }: Props) => (
  <Modal
    open={isOpen}
    header={{ heading: 'Feilregistrert oppgave' }}
    onClose={close}
    width="medium"
    closeOnBackdropClick
  >
    <Content close={close} />
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
      <Modal.Body>
        <BodyShort spacing>
          <time dateTime={oppgave.feilregistrering.registered}>
            {isoDateTimeToPretty(oppgave.feilregistrering.registered)}
          </time>
        </BodyShort>
        <BodyShort>Feilregistrert av: {formatEmployeeName(oppgave.feilregistrering.feilregistrertAv)}</BodyShort>
        <BodyShort spacing>Fagsystem: {fagsystemName}</BodyShort>
        <Heading level="2" size="small" spacing>
          Årsak
        </Heading>
        <BodyLong spacing className="border-ax-border-neutral-subtle border-l-6 pl-4">
          {oppgave.feilregistrering.reason}
        </BodyLong>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" size="small" icon={<XMarkIcon aria-hidden />} onClick={close}>
          Lukk
        </Button>
      </Modal.Footer>
    </>
  );
};
