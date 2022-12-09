import { Heading, Loader } from '@navikt/ds-react';
import React from 'react';
import { useOppgave } from '../../../hooks/oppgavebehandling/use-oppgave';
import { useKvalitetsvurdering } from '../../../hooks/use-kvalitetsvurdering';
import { Radiovalg } from '../../../types/kaka-kvalitetsvurdering/radio';
import { SaksTypeEnum } from '../../../types/kodeverk';
import { Reason, Reasons } from './reasons';
import { FormSection } from './styled-components';

export const Annet = () => {
  const { data: oppgave } = useOppgave();
  const [kvalitetsvurdering, isLoading] = useKvalitetsvurdering();

  if (isLoading || typeof oppgave === 'undefined' || typeof kvalitetsvurdering === 'undefined') {
    return <Loader size="xlarge" />;
  }

  const showNyeOpplysningerMottattReason = kvalitetsvurdering.utredningenRadioValg === Radiovalg.BRA;

  const showBetydeligAvvikReason =
    kvalitetsvurdering.vedtaketRadioValg === Radiovalg.MANGELFULLT ||
    kvalitetsvurdering.utredningenRadioValg === Radiovalg.MANGELFULLT;

  const showBrukIOpplaeringReason = kvalitetsvurdering.vedtaketRadioValg === Radiovalg.BRA;

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

  const reasons = oppgave.type === SaksTypeEnum.ANKE ? baseReasons : [...baseReasons, ...klageReasons];

  return (
    <FormSection>
      <Heading level="2" size="small">
        Annet
      </Heading>
      <Reasons reasons={reasons} />
    </FormSection>
  );
};
