import { FORMAT, PRETTY_FORMAT } from '@app/components/date-picker/constants';
import { GrafanaDomainProvider } from '@app/components/grafana-domain-context/grafana-domain-context';
import {
  Beskrivelse,
  getInitialBeskrivelse,
} from '@app/components/oppgavebehandling-footer/update-in-gosys/beskrivelse';
import { Enhetmappe } from '@app/components/oppgavebehandling-footer/update-in-gosys/enhetmappe';
import { GosysOppgave } from '@app/components/oppgavebehandling-footer/update-in-gosys/gosys-oppgave';
import { ReceivingEnhet } from '@app/components/oppgavebehandling-footer/update-in-gosys/receiving-enhet';
import { ValidationSummary } from '@app/components/oppgavebehandling-footer/validation-summary';
import { type IValidationSection, isReduxValidationResponse } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingWithUpdateInGosysMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { useSetGosysOppgaveMutation } from '@app/redux-api/oppgaver/mutations/set-gosys-oppgave';
import { useGetGosysOppgaveQuery } from '@app/redux-api/oppgaver/queries/behandling/behandling';
import { useSearchEnheterQuery } from '@app/redux-api/search';
import { useUtfall } from '@app/simple-api-state/use-kodeverk';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import {
  type BehandlingGosysOppgave,
  type Enhet,
  GosysStatus,
  type IOppgavebehandling,
} from '@app/types/oppgavebehandling/oppgavebehandling';
import { Alert, BodyShort, Button, ConfirmationPanel, Heading, Modal, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';
import { format } from 'date-fns';
import { useState } from 'react';

const NOW = new Date();

interface Props {
  children: string;
}

export const UpdateInGosys = (props: Props) => {
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
      {...props}
    />
  );
};

interface LoadedProps extends Props {
  oppgavebehandling: IOppgavebehandling;
  enheter: Enhet[];
  initialBeskrivelse: string;
}

const UpdateInGosysLoaded = ({ oppgavebehandling, enheter, initialBeskrivelse, children }: LoadedProps) => {
  const [selectedEnhet, setSelectedEnhet] = useState<string | null>(null);
  const [selectedMappe, setSelectedMappe] = useState<number | null>(null);
  const [beskrivelse, setBeskrivelse] = useState(initialBeskrivelse);
  const [ignoreGosysOppgave, setIgnoreGosysOppgave] = useState(false);
  const [finish, { isLoading: isFinishing }] = useFinishOppgavebehandlingWithUpdateInGosysMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [enhetError, setEnhetError] = useState<string | null>(null);
  const [, { isLoading: isSettingGosysOppgave }] = useSetGosysOppgaveMutation({ fixedCacheKey: oppgavebehandling.id });
  const { gosysOppgaveId } = oppgavebehandling;
  const { data: gosysOppgave, isSuccess: hasGosysOppgave } = useGetGosysOppgaveQuery(
    gosysOppgaveId === null ? skipToken : oppgavebehandling.id,
  );
  const [validationSectionErrors, setValidationSectionErrors] = useState<IValidationSection[]>([]);

  const gosysOppgaveIsOpen = hasGosysOppgave && gosysOppgave.editable;

  const handleFinish = async () => {
    try {
      const kvalitetsvurderingId = oppgavebehandling.kvalitetsvurderingReference?.id ?? null;
      const oppgaveId = oppgavebehandling.id;

      if (gosysOppgaveIsOpen) {
        if (selectedEnhet === null) {
          return setEnhetError('Du må velge en enhet');
        }

        setEnhetError(null);

        const gosysOppgaveUpdate = { kommentar: beskrivelse, tildeltEnhet: selectedEnhet, mappeId: selectedMappe };

        await finish({ kvalitetsvurderingId, oppgaveId, gosysOppgaveUpdate, ignoreGosysOppgave });

        setIsOpen(false);
      } else {
        setEnhetError(null);

        await finish({ kvalitetsvurderingId, oppgaveId, gosysOppgaveUpdate: null, ignoreGosysOppgave }).unwrap();
      }
    } catch (e) {
      if (isReduxValidationResponse(e)) {
        setValidationSectionErrors(e.data.sections);
      }
    }
  };

  return (
    <div className="[grid-area:left]">
      <Button variant="primary" size="small" onClick={() => setIsOpen(true)}>
        {children}
      </Button>

      <Modal
        aria-label="Oppdater oppgaven i Gosys og fullfør"
        open={isOpen}
        onClose={() => setIsOpen(false)}
        header={{ heading: 'Oppdater oppgaven i Gosys og fullfør', closeButton: true }}
        width="0min(90vw, 1100px)"
      >
        <Modal.Body>
          <VStack gap="6">
            <GrafanaDomainProvider domain="oppgave-finish">
              <GosysOppgave oppgavebehandling={oppgavebehandling} />
            </GrafanaDomainProvider>

            {gosysOppgaveIsOpen ? (
              <VStack gap="3" width="min-content">
                {oppgavebehandling.typeId === SaksTypeEnum.ANKE &&
                (oppgavebehandling.resultat.utfallId === UtfallEnum.DELVIS_MEDHOLD ||
                  oppgavebehandling.resultat.extraUtfallIdSet.includes(UtfallEnum.DELVIS_MEDHOLD)) ? (
                  <Alert variant="info" size="small">
                    Oppdater denne oppgaven fra Gosys ved å velge enhetsmappe "Sendt til Trygderetten". Du må i tillegg
                    gå inn i Gosys og opprette en ny oppgave der, som du sender til vedtaksenheten med beskjed om at de
                    kan effektuere det du har gitt delvis medhold i.
                  </Alert>
                ) : null}

                <Beskrivelse beskrivelse={beskrivelse} setBeskrivelse={setBeskrivelse} />

                <BodyShort size="small">
                  <b>
                    Frist: <time dateTime={format(NOW, FORMAT)}>{format(NOW, PRETTY_FORMAT)}</time>
                  </b>
                </BodyShort>

                <ReceivingEnhet
                  selectedEnhet={selectedEnhet}
                  setSelectedEnhet={(e) => {
                    if (e === selectedEnhet) {
                      return;
                    }

                    setSelectedEnhet(e);
                    setSelectedMappe(null);
                  }}
                  error={enhetError}
                  enheter={enheter}
                  oppgavebehandling={oppgavebehandling}
                />

                <Enhetmappe
                  enhetId={selectedEnhet}
                  selectedMappe={selectedMappe}
                  setSelectedMappe={setSelectedMappe}
                  oppgavebehandling={oppgavebehandling}
                />
              </VStack>
            ) : (
              <ConfirmIgnoreOrRequiredWarning
                gosysOppgave={gosysOppgave}
                ignoreGosysOppgave={ignoreGosysOppgave}
                setIgnoreGosysOppgave={setIgnoreGosysOppgave}
              />
            )}

            <ValidationSummary sections={validationSectionErrors} />
          </VStack>
        </Modal.Body>

        <Modal.Footer>
          <Button size="small" variant="primary" onClick={handleFinish} loading={isFinishing || isSettingGosysOppgave}>
            Oppdater og fullfør
          </Button>
          <Button size="small" variant="secondary-neutral" disabled={isFinishing} onClick={() => setIsOpen(false)}>
            Avbryt
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

interface ConfirmProps {
  gosysOppgave: BehandlingGosysOppgave | undefined;
  ignoreGosysOppgave: boolean;
  setIgnoreGosysOppgave: (value: boolean) => void;
}

const ConfirmIgnoreOrRequiredWarning = ({ gosysOppgave, ignoreGosysOppgave, setIgnoreGosysOppgave }: ConfirmProps) => {
  if (gosysOppgave === undefined) {
    return (
      <Alert size="small" variant="warning">
        <Heading level="2" size="small" spacing>
          Ingen oppgave fra Gosys
        </Heading>
        <BodyShort size="small" spacing>
          Velg oppgave over. Dersom du ikke finner riktig oppgave, må du gå inn i Gosys og opprette en der, som du
          deretter kan velge i Kabal.
        </BodyShort>
        <BodyShort size="small">Trykk på ikon </BodyShort>
      </Alert>
    );
  }

  if (gosysOppgave.editable === true) {
    return null;
  }

  if (gosysOppgave.status === GosysStatus.FERDIGSTILT) {
    return (
      <ConfirmationPanel
        size="small"
        checked={ignoreGosysOppgave}
        onChange={({ target }) => setIgnoreGosysOppgave(target.checked)}
        label="Ja, jeg vil bruke den allerede ferdigstilte oppgaven fra Gosys."
      >
        <Heading level="2" size="small">
          Oppgaven fra Gosys er ferdigstilt
        </Heading>
      </ConfirmationPanel>
    );
  }

  if (gosysOppgave.status === GosysStatus.FEILREGISTRERT) {
    return (
      <ConfirmationPanel
        size="small"
        checked={ignoreGosysOppgave}
        onChange={({ target }) => setIgnoreGosysOppgave(target.checked)}
        label="Ja, jeg vil bruke den allerede feilregistrerte oppgaven fra Gosys."
      >
        <Heading level="2" size="small">
          Oppgaven fra Gosys er feilregistrert
        </Heading>
      </ConfirmationPanel>
    );
  }

  return null;
};
