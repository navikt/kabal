import { BeregnetFrist } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/beregnet-frist';
import { SetBehandlingstid } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-behandlingstid';
import { SetBehandlingstidDate } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-behandlingstid-date';
import { SetCustomText } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-custom-text';
import { SetFullmektigFritekst } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-fullmektig-fritekst';
import { SetPreviousBehandlingstidInfo } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-previous-behandlingstid-info';
import { SetReason } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-reason';
import { SetReceivers } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-receivers';
import { SetTitle } from '@app/components/behandling/behandlingsdetaljer/forlenget-behandlingstid/set-title';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { useGetOrCreateQuery } from '@app/redux-api/forlenget-behandlingstid';
import { Alert, HStack, Skeleton, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const Inputs = () => {
  const { data: oppgave, isSuccess: oppgaveIsSuccess } = useOppgave();
  const { data, isLoading, isError, isSuccess } = useGetOrCreateQuery(oppgave?.id ?? skipToken);

  if (isLoading) {
    return (
      <VStack gap="4">
        <HStack justify="space-between">
          <HStack gap="3">
            <Skeleton width="100px" height="32px" variant="rectangle" />

            <HStack gap="1">
              <Skeleton width="60px" height="32px" variant="rectangle" />
              <Skeleton width="60px" height="32px" variant="rectangle" />
            </HStack>
          </HStack>

          <Vr />
          <Skeleton width="150px" height="32px" variant="rectangle" />
        </HStack>

        <Skeleton width="100%" height="32px" variant="rectangle" />
        <Skeleton width="100%" height="32px" variant="rectangle" />

        <Skeleton width="100%" height="64px" variant="rectangle" />
        <Skeleton width="100%" height="96px" variant="rectangle" />
        <Skeleton width="100%" height="96px" variant="rectangle" />

        <Skeleton width="100%" height="110px" variant="rectangle" />
        <Skeleton width="100%" height="110px" variant="rectangle" />

        <Skeleton width="250px" height="32px" variant="rectangle" />
      </VStack>
    );
  }

  if (isError || !isSuccess || !oppgaveIsSuccess) {
    return (
      <Alert size="small" variant="error">
        Kunne ikke hente data for forlenget saksbehandlingstid
      </Alert>
    );
  }

  const { id, prosessfullmektig } = oppgave;

  return (
    <VStack gap="4">
      <HStack justify="space-between" wrap gap="4">
        <SetBehandlingstid
          id={id}
          typeId={data.behandlingstid.varsletBehandlingstidUnitTypeId}
          units={data.behandlingstid.varsletBehandlingstidUnits}
          varsletFrist={data.behandlingstid.varsletFrist}
        />
        <BeregnetFrist
          units={data.behandlingstid.varsletBehandlingstidUnits}
          typeId={data.behandlingstid.varsletBehandlingstidUnitTypeId}
          varsletFrist={data.behandlingstid.varsletFrist}
        />

        <Vr />
        <SetBehandlingstidDate id={id} value={data.behandlingstid.varsletFrist} />
      </HStack>

      <SetTitle id={id} value={data.title} />
      {prosessfullmektig === null ? null : <SetFullmektigFritekst id={id} value={data.fullmektigFritekst} />}
      <SetPreviousBehandlingstidInfo id={id} value={data.previousBehandlingstidInfo} />
      <SetReason id={id} value={data.reason} />
      <SetCustomText id={id} value={data.customText} />

      <SetReceivers id={id} value={data.receivers} />
    </VStack>
  );
};

const Vr = () => <div className="mr-3 ml-3 h-full border-b-gray-700 border-l-1 " />;
