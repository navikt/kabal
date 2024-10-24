import { SelectGosysOppgave } from '@app/components/behandling/behandlingsdetaljer/select-gosys-oppgave/select-gosys-oppgave';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { usePushEvent } from '@app/observability';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { type BehandlingGosysOppgave, GosysStatus } from '@app/types/oppgavebehandling/oppgavebehandling';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';
import { Button, ConfirmationPanel, Heading, Loader } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { useState } from 'react';

export const GosysOppgave = () => {
  const { data: oppgave } = useOppgave();
  const { data, isSuccess, isLoading } = useGetGosysOppgaveQuery(oppgave?.id ?? skipToken);
  const [keepFinished, setKeepFinished] = useState(false); // TODO: Send to backend.

  if (isLoading || oppgave === undefined) {
    return <Loader title="Laster..." />;
  }

  if (!isSuccess) {
    return null;
  }

  if (data.status !== GosysStatus.FERDIGSTILT) {
    return <ToggleSelectGosysOppgave selectedGosysOppgave={data} />;
  }

  return (
    <>
      <ConfirmationPanel
        checked={keepFinished}
        onChange={({ target }) => setKeepFinished(target.checked)}
        label="Ja, jeg vil bruke den allerede ferdigstilte oppgaven fra Gosys"
      >
        <Heading level="2" size="medium">
          Oppgaven fra Gosys er ferdigstilt
        </Heading>
      </ConfirmationPanel>

      <ToggleSelectGosysOppgave selectedGosysOppgave={data} />
    </>
  );
};

interface SelectOppgaveProps {
  selectedGosysOppgave: BehandlingGosysOppgave | undefined;
}

const ToggleSelectGosysOppgave = ({ selectedGosysOppgave }: SelectOppgaveProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const pushEvent = usePushEvent();
  const hasGosysOppgave = selectedGosysOppgave !== undefined;

  const onOpen = () => {
    setIsOpen(true);
    pushEvent('show-selected-gosys-oppgave', {
      hasGosysOppgave: hasGosysOppgave.toString(),
      selectedGosysOppgaveStatus: selectedGosysOppgave?.status ?? 'NONE',
    });
  };

  return (
    <>
      {isOpen ? (
        <SelectGosysOppgave>
          <Button
            size="small"
            onClick={() => setIsOpen(false)}
            variant="secondary"
            style={{ alignSelf: 'flex-start' }}
            icon={<ChevronUpIcon aria-hidden />}
          >
            Skjul oppgave fra Gosys
          </Button>
        </SelectGosysOppgave>
      ) : (
        <Button
          size="small"
          onClick={onOpen}
          variant="secondary"
          icon={<ChevronDownIcon aria-hidden />}
          style={{ alignSelf: 'flex-start' }}
        >
          {hasGosysOppgave ? 'Vis valgt oppgave fra Gosys' : 'Velg oppgave fra Gosys'}
        </Button>
      )}
    </>
  );
};
