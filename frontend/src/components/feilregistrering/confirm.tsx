import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, HStack } from '@navikt/ds-react';
import { useContext } from 'react';
import { Context } from './context';

interface ConfirmProps {
  setIsConfirmed: () => void;
}

export const Confirm = ({ setIsConfirmed }: ConfirmProps) => {
  const { data: oppgave } = useOppgave();
  const { close } = useContext(Context);

  if (oppgave === undefined) {
    return null;
  }

  const text = oppgave.requiresGosysOppgave ? `${DEFAULT_TEXT} ${REQUIRED_GOSYS_OPPGAVE_SUFFIX}` : DEFAULT_TEXT;

  return (
    <>
      <Alert variant="info" inline>
        {text}
      </Alert>

      <HStack align="center" justify="space-between" gap="0 4" wrap={false}>
        <Button
          size="small"
          variant="primary"
          onClick={setIsConfirmed}
          icon={<CheckmarkIcon aria-hidden />}
          className="whitespace-nowrap"
        >
          Jeg forstår, gå til feilregistrering.
        </Button>

        <Button size="small" variant="secondary" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </HStack>
    </>
  );
};

const DEFAULT_TEXT =
  'Feilregistrering er noe annet enn utfallene «trukket» eller «retur». Du skal kun feilregistrere dersom saken aldri skulle vært i Kabal, for eksempel om vedtaksenheten har bedt om å få saken tilbake fordi den ble sendt til klageinstansen ved en feil, eller fordi samme sak er registrert to ganger ved en feil.';

const REQUIRED_GOSYS_OPPGAVE_SUFFIX =
  'Husk at du må oppdatere oppgaven i Gosys med beskjed til vedtaksenheten om at du har feilregistrert.';
