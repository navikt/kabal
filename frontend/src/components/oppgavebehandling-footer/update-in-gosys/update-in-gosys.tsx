import { FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import {
  Beskrivelse,
  getInitialBeskrivelse,
} from '@app/components/oppgavebehandling-footer/update-in-gosys/beskrivelse';
import { Enhetmappe } from '@app/components/oppgavebehandling-footer/update-in-gosys/enhetmappe';
import { GosysOppgave } from '@app/components/oppgavebehandling-footer/update-in-gosys/gosys-oppgave';
import { ReceivingEnhet } from '@app/components/oppgavebehandling-footer/update-in-gosys/receiving-enhet';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingWithUpdateInGosysMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useSetGosysOppgaveMutation } from '@app/redux-api/oppgaver/mutations/set-gosys-oppgave';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import type { Enhet, IOppgavebehandling } from '@app/types/oppgavebehandling/oppgavebehandling';
import { BodyShort, Button, Modal, VStack } from '@navikt/ds-react';
import { format } from 'date-fns';
import { useState } from 'react';

const NOW = new Date();

export const UpdateInGosys = () => {
  const { data: oppgavebehandling, isSuccess: oppgaveIsSuccess } = useOppgave();
  const { data: utfall } = useUtfall();
  const { data: enheter, isSuccess: enheterIsSuccess } = useSearchEnheterQuery({});

  if (!oppgaveIsSuccess || utfall === undefined || !enheterIsSuccess) {
    return null;
  }

  const initialBeskrivelse = getInitialBeskrivelse(oppgavebehandling, utfall);

  return (
    <UpdateInGosysLoaded
      oppgavebehandling={oppgavebehandling}
      enheter={enheter}
      initialBeskrivelse={initialBeskrivelse}
    />
  );
};

interface Props {
  oppgavebehandling: IOppgavebehandling;
  enheter: Enhet[];
  initialBeskrivelse: string;
}

const UpdateInGosysLoaded = ({ oppgavebehandling, enheter, initialBeskrivelse }: Props) => {
  const [selectedEnhet, setSelectedEnhet] = useState<string | null>(null);
  const [selectedMappe, setSelectedMappe] = useState<number | null>(null);
  const [beskrivelse, setBeskrivelse] = useState(initialBeskrivelse);
  const [finish, { isLoading }] = useFinishOppgavebehandlingWithUpdateInGosysMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [enhetError, setEnhetError] = useState<string | null>(null);
  const [, { isLoading: isSettingGosysOppgave }] = useSetGosysOppgaveMutation({ fixedCacheKey: oppgavebehandling.id });

  const handleFinish = async () => {
    if (selectedEnhet === null) {
      return setEnhetError('Du må velge en enhet');
    }

    setEnhetError(null);

    await finish({
      oppgaveId: oppgavebehandling.id,
      kvalitetsvurderingId: oppgavebehandling.kvalitetsvurderingReference?.id ?? null,
      kommentar: beskrivelse,
      tildeltEnhet: selectedEnhet,
      mappeId: selectedMappe,
    }).unwrap();

    setIsOpen(false);
  };

  return (
    <div style={{ gridArea: 'left' }}>
      <Button variant="primary" size="small" onClick={() => setIsOpen(true)}>
        Fullfør
      </Button>

      <Modal
        aria-label="Oppdater oppgaven i Gosys"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header={{ heading: 'Oppdater oppgaven i Gosys', closeButton: true }}
        width="0min(90vw, 1100px)"
      >
        <Modal.Body>
          <VStack gap="6">
            <GrafanaDomainProvider domain="oppgave-finish">
              <GosysOppgave />
            </GrafanaDomainProvider>

            <VStack gap="3" width="min-content">
              <Beskrivelse beskrivelse={beskrivelse} setBeskrivelse={setBeskrivelse} />

              <BodyShort size="small">
                <b>
                  Frist: <time dateTime={format(NOW, FORMAT)}>{format(NOW, PRETTY_FORMAT)}</time>
                </b>
              </BodyShort>

              <ReceivingEnhet
                selectedEnhet={selectedEnhet}
                setSelectedEnhet={setSelectedEnhet}
                error={enhetError}
                enheter={enheter}
                oppgavebehandling={oppgavebehandling}
              />

              <Enhetmappe enhetId={selectedEnhet} selectedMappe={selectedMappe} setSelectedMappe={setSelectedMappe} />
            </VStack>
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button size="small" variant="primary" onClick={handleFinish} loading={isLoading || isSettingGosysOppgave}>
            Oppdater og fullfør
          </Button>
          <Button size="small" variant="secondary" disabled={isLoading} onClick={() => setIsOpen(false)}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
