import { CheckmarkIcon, XMarkIcon } from '@navikt/aksel-icons';
import { BodyLong, Button } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { FooterPopup } from '@app/components/oppgavebehandling-footer/popup';
import { isReduxValidationResponse } from '@app/functions/error-type-guard';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useFinishOppgavebehandlingMutation } from '@app/redux-api/oppgaver/mutations/behandling';
import { SaksTypeEnum, UtfallEnum } from '@app/types/kodeverk';
import { IFinishOppgavebehandlingParams } from '@app/types/oppgavebehandling/params';
import { ValidationErrorContext } from '../kvalitetsvurdering/validation-error-context';
import { StyledFinishOppgaveButtons } from './styled-components';

interface FinishProps {
  cancel: () => void;
  show: boolean;
}

export const ConfirmFinish = ({ cancel, show }: FinishProps) => {
  const { data: oppgave } = useOppgave();

  if (!show || oppgave === undefined) {
    return null;
  }

  const isOpphevetInTrygderetten =
    oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET;

  const finishText = isOpphevetInTrygderetten ? 'Nei, fullfør uten å opprette ny oppgave i Kabal.' : 'Fullfør';

  return (
    <FooterPopup close={cancel}>
      <BodyLong>{getText(oppgave.typeId, oppgave.resultat.utfallId)}</BodyLong>
      <StyledFinishOppgaveButtons $width={isOpphevetInTrygderetten ? 600 : 400}>
        {isOpphevetInTrygderetten ? <FinishOpphevetTRWithNyBehandling /> : null}
        <FinishButton>{finishText}</FinishButton>
        <Button
          variant="secondary"
          type="button"
          size="small"
          onClick={cancel}
          data-testid="cancel-finish-klagebehandling-button"
          icon={<XMarkIcon aria-hidden />}
        >
          Avbryt
        </Button>
      </StyledFinishOppgaveButtons>
    </FooterPopup>
  );
};

const getText = (oppgaveType: SaksTypeEnum, utfallId: UtfallEnum | null): string => {
  if (oppgaveType === SaksTypeEnum.KLAGE) {
    return 'Du fullfører nå klagebehandlingen. Klagebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
  }

  if (oppgaveType === SaksTypeEnum.ANKE) {
    if (utfallId === UtfallEnum.INNSTILLING_STADFESTELSE || utfallId === UtfallEnum.INNSTILLING_AVVIST) {
      return 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
    }

    if (utfallId === UtfallEnum.DELVIS_MEDHOLD) {
      return 'Bekreft at du har gjennomført overføring til Trygderetten i Gosys for den delen av saken du ikke har omgjort, før du fullfører behandlingen i Kabal. Ankebehandlingen kan ikke redigeres når den er fullført.';
    }

    return 'Du fullfører nå ankebehandlingen. Ankebehandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
  }

  if (oppgaveType === SaksTypeEnum.ANKE_I_TRYGDERETTEN) {
    if (utfallId === UtfallEnum.HENVIST) {
      return 'Du har valgt «henvist» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Når du trykker «Fullfør», vil Kabal opprette en ny ankeoppgave som du skal behandle. Du finner oppgaven under «Søk på person». Vær oppmerksom på at det kan ta noen minutter før ankebehandlingen er opprettet.';
    }

    if (utfallId === UtfallEnum.OPPHEVET) {
      return 'Du har valgt «opphevet» som resultat fra Trygderetten. Du fullfører nå registrering av resultatet. Skal klageinstansen behandle saken på nytt?';
    }

    return 'Du fullfører nå registrering av utfall/resultat fra Trygderetten. Registreringen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre registreringen.';
  }

  return 'Du fullfører nå behandlingen. Behandlingen kan ikke redigeres når den er fullført. Bekreft at du faktisk ønsker å fullføre behandlingen.';
};

const FinishOpphevetTRWithNyBehandling = () => (
  <FinishButton nyBehandling>Ja, fullfør og opprett ny ankeoppgave i Kabal.</FinishButton>
);

interface FinishButtonProps {
  nyBehandling?: boolean;
  children: string;
}

const FinishButton = ({ children, nyBehandling = false }: FinishButtonProps) => {
  const [finishOppgavebehandling, loader] = useFinishOppgavebehandlingMutation();
  const [hasBeenFinished, setHasBeenFinished] = useState<boolean>(false);
  const errorContext = useContext(ValidationErrorContext);
  const { data: oppgave, isLoading } = useOppgave();

  if (isLoading || oppgave === undefined) {
    return null;
  }

  const finish = async () => {
    if (typeof oppgave === 'undefined') {
      return;
    }

    const params: IFinishOppgavebehandlingParams =
      oppgave.typeId === SaksTypeEnum.ANKE_I_TRYGDERETTEN && oppgave.resultat.utfallId === UtfallEnum.OPPHEVET
        ? {
            oppgaveId: oppgave.id,
            typeId: oppgave.typeId,
            utfall: oppgave.resultat.utfallId,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling,
          }
        : {
            oppgaveId: oppgave.id,
            kvalitetsvurderingId: oppgave.kvalitetsvurderingReference?.id ?? null,
            nyBehandling: false,
          };

    finishOppgavebehandling(params)
      .unwrap()
      .then((res) => {
        setHasBeenFinished(res.isAvsluttetAvSaksbehandler);
        errorContext?.setValidationSectionErrors([]);
      })
      .catch((error) => {
        if (typeof errorContext !== 'undefined' && isReduxValidationResponse(error)) {
          errorContext.setValidationSectionErrors(error.data.sections);
        }
      });
  };

  return (
    <Button
      variant="primary"
      size="small"
      type="button"
      onClick={finish}
      loading={hasBeenFinished || loader.isLoading}
      disabled={hasBeenFinished || loader.isLoading}
      data-testid="confirm-finish-klagebehandling-button"
      icon={<CheckmarkIcon aria-hidden />}
    >
      {children}
    </Button>
  );
};
