import { BodyShort, Button, Modal } from '@navikt/ds-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { styled } from 'styled-components';
import { FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import {
  Beskrivelse,
  getInitialBeskrivelse,
} from '@app/components/oppgavebehandling-footer/update-in-gosys/beskrivelse';
import { EnhetSearch } from '@app/components/oppgavebehandling-footer/update-in-gosys/enhet-search';
import { Enhetmappe } from '@app/components/oppgavebehandling-footer/update-in-gosys/enhetmappe';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';

const NOW = new Date();

export const UpdateInGosys = () => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess } = useOppgave();
  const { data: utfall } = useUtfall();
  const { data: enheter, isSuccess: enheterIsSuccess } = useSearchEnheterQuery({});

  if (!oppgaveIsSuccess || utfall === undefined || !enheterIsSuccess) {
    return null;
  }

  const initialBeskrivelse = getInitialBeskrivelse(oppgave, utfall);

  return <UpdateInGosysLoaded oppgave={oppgave} enheter={enheter} initialBeskrivelse={initialBeskrivelse} />;
};

interface Props {
  oppgave: IOppgavebehandling;
  enheter: Enhet[];
  initialBeskrivelse: string;
}

const UpdateInGosysLoaded = ({ oppgave: oppgavebehandling, enheter, initialBeskrivelse }: Props) => {
  const [selectedEnhet, setSelectedEnhet] = useState<string | null>(null);
  const [selectedMappe, setSelectedMappe] = useState<number | null>(null);
  const [beskrivelse, setBeskrivelse] = useState(initialBeskrivelse);
  const [finish, { isLoading }] = useFinishOppgavebehandlingMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [enhetError, setEnhetError] = useState<string | null>(null);

  const handleFinish = async () => {
    if (selectedEnhet === null) {
      return setEnhetError('Du må velge en enhet');
    }

    setEnhetError(null);

    await finish({
      oppgaveId: oppgavebehandling.id,
      kvalitetsvurderingId: oppgavebehandling.kvalitetsvurderingReference?.id ?? null,
      nyBehandling: false,
      kommentar: beskrivelse,
      tildeltEnhet: selectedEnhet,
      mappeId: selectedMappe,
    }).unwrap();

    setIsOpen(false);
  };

  return (
    <>
      <Button variant="primary" size="small" onClick={() => setIsOpen(true)}>
        Fullfør
      </Button>

      <Modal
        aria-label="Oppdater oppgaven i Gosys"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header={{ heading: 'Oppdater oppgaven i Gosys' }}
      >
        <Container>
          <Beskrivelse beskrivelse={beskrivelse} setBeskrivelse={setBeskrivelse} />

          <BodyShort size="small">
            <b>
              Frist: <time dateTime={format(NOW, FORMAT)}>{format(NOW, PRETTY_FORMAT)}</time>
            </b>
          </BodyShort>

          <EnhetSearch
            selectedEnhet={selectedEnhet}
            setSelectedEnhet={setSelectedEnhet}
            error={enhetError}
            enheter={enheter}
            oppgavebehandling={oppgavebehandling}
          />

          <Enhetmappe enhetId={selectedEnhet} selectedMappe={selectedMappe} setSelectedMappe={setSelectedMappe} />

          <Buttons>
            <Button size="small" variant="secondary" disabled={isLoading} onClick={() => setIsOpen(false)}>
              Avbryt
            </Button>
            <Button size="small" variant="primary" onClick={handleFinish} loading={isLoading}>
              Oppdater i Gosys
            </Button>
          </Buttons>
        </Container>
      </Modal>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--a-spacing-6);
  padding: var(--a-spacing-6);
`;

const Buttons = styled.div`
  display: flex;
  gap: var(--a-spacing-3);
  justify-content: flex-end;
`;
