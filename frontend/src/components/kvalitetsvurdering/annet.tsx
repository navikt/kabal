import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '../../hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { RadioValg } from '../../types/kaka-kvalitetsvurdering';
import { OppgaveType } from '../../types/kodeverk';
import { Reason, Reasons } from './reasons';
import { FormSection } from './styled-components';

export const Annet = () => {
  const { data: oppgave } = useOppgave();
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();

  if (isLoading || typeof oppgave === 'undefined' || typeof kvalitetsvurdering === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const showNyeOpplysningerMottattReason = kvalitetsvurdering.utredningenRadioValg === RadioValg.BRA;

  const showBetydeligAvvikReason =
    kvalitetsvurdering.vedtaketRadioValg === RadioValg.MANGELFULLT ||
    kvalitetsvurdering.utredningenRadioValg === RadioValg.MANGELFULLT;

  const showBrukIOpplaeringReason = kvalitetsvurdering.vedtaketRadioValg === RadioValg.BRA;

  const showForm = showNyeOpplysningerMottattReason || showBetydeligAvvikReason || showBrukIOpplaeringReason;

  if (!showForm) {
    return null;
  }

  const baseReasons: Reason[] = [
    {
      id: 'nyeOpplysningerMottatt',
      label: 'Nye opplysninger mottatt etter oversendelse til klageinstansen',
      checked: kvalitetsvurdering.nyeOpplysningerMottatt,
      show: showNyeOpplysningerMottattReason,
      helpText: 'Benyttes når utredningen til vedtaksinstansen er tilstrekkelig',
    },
    {
      id: 'betydeligAvvik',
      label: 'Betydelig avvik med stor økonomisk konsekvens for søker',
      checked: kvalitetsvurdering.betydeligAvvik,
      textareaId: 'betydeligAvvikText',
      show: showBetydeligAvvikReason,
      helpText: 'Benyttes når vedtaksinstans bør varsles umiddelbart om resultatet av behandlingen',
    },
  ];

  const klageReasons: Reason[] = [
    {
      id: 'brukIOpplaering',
      label: 'Bruk gjerne vedtaket som eksempel i opplæring',
      checked: kvalitetsvurdering.brukIOpplaering,
      textareaId: 'brukIOpplaeringText',
      show: showBrukIOpplaeringReason,
      helpText: 'Benyttes på spesielt gode vedtak, til opplæring i vedtaksinstans.',
    },
  ];

  const reasons = oppgave.type === OppgaveType.ANKE ? baseReasons : [...baseReasons, ...klageReasons];

  return (
    <FormSection>
      <Heading level="2" size="small">
        Annet
      </Heading>
      <Reasons reasons={reasons} />
    </FormSection>
  );
};
