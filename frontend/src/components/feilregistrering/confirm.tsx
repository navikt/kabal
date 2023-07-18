import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { Alert, Button, Loader } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { styled } from 'styled-components';
import { FagsystemId } from '@app/components/feilregistrering/types';
import { useFagsystemer } from '@app/simple-api-state/use-kodeverk';
import { Context } from './context';
import { Row } from './styled-components';

interface ConfirmProps extends FagsystemId {
  setIsConfirmed: () => void;
}

export const Confirm = ({ setIsConfirmed, fagsystemId }: ConfirmProps) => {
  const { close } = useContext(Context);
  const [text, isLoading] = useText(fagsystemId);

  return (
    <>
      {isLoading ? (
        <Loader title="Laster..." />
      ) : (
        <Alert variant="info" inline>
          {text}
        </Alert>
      )}
      <Row>
        <StyledButton size="small" variant="primary" onClick={setIsConfirmed} icon={<CheckmarkIcon aria-hidden />}>
          Jeg forstår, gå til feilregistrering.
        </StyledButton>
        <Button size="small" variant="secondary" onClick={close} icon={<XMarkIcon aria-hidden />}>
          Avbryt
        </Button>
      </Row>
    </>
  );
};

const StyledButton = styled(Button)`
  white-space: nowrap;
`;

const DEFAULT_TEXT = `Feilregistrering er noe annet enn utfallene "trukket" eller "retur". Du skal kun feilregistrere dersom saken aldri skulle vært i Kabal, for eksempel om vedtaksenheten har bedt om å få saken tilbake fordi den ble sendt til klageinstansen ved en feil, eller fordi samme sak er registrert to ganger ved en feil.`;

const NON_MODERNIZED_SUFFIX =
  'Husk at du må oppdatere oppgaven i Gosys med beskjed til vedtaksenheten om at du har feilregistrert.';

const UNKNOWN_MODERNIZED_SUFFIX =
  'Husk at du kanskje (ukjent fagsystem) må oppdatere oppgaven i Gosys med beskjed til vedtaksenheten om at du har feilregistrert.';

type Text = [undefined, true] | [string, false];

const useText = (fagsystemId: string): Text => {
  const { data: fagsystemer = [], isLoading } = useFagsystemer();

  if (isLoading) {
    return [undefined, true];
  }

  const fagsystem = fagsystemer.find(({ id }) => id === fagsystemId);

  if (fagsystem === undefined) {
    return [`${UNKNOWN_MODERNIZED_SUFFIX} ${NON_MODERNIZED_SUFFIX}`, false];
  }

  if (fagsystem.modernized) {
    return [DEFAULT_TEXT, false];
  }

  return [`${DEFAULT_TEXT} ${NON_MODERNIZED_SUFFIX}`, false];
};
