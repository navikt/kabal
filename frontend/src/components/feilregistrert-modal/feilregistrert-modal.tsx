import { XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, BodyShort, Button, Dialog, Heading, Loader } from '@navikt/ds-react';
import { isoDateTimeToPretty } from '@/domain/date';
import { formatEmployeeName } from '@/domain/employee-name';
import { useOppgave } from '@/hooks/oppgavebehandling/use-oppgave';
import { useFagsystemName } from '@/hooks/use-fagsystem-name';

interface Props extends ContentProps {
  isOpen: boolean;
}

export const FeilregistrertModal = ({ isOpen, close }: Props) => (
  <Dialog open={isOpen} onOpenChange={(next) => !next && close()}>
    <Dialog.Popup width="medium">
      <Dialog.Header>
        <Dialog.Title>Feilregistrert oppgave</Dialog.Title>
      </Dialog.Header>
      <Content close={close} />
    </Dialog.Popup>
  </Dialog>
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
      <Dialog.Body>
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
      </Dialog.Body>
      <Dialog.Footer>
        <Button variant="primary" size="small" icon={<XMarkIcon aria-hidden />} onClick={close}>
          Lukk
        </Button>
      </Dialog.Footer>
    </>
  );
};
