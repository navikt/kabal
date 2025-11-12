import { XMarkOctagonFillIconColored } from '@app/components/colored-icons/colored-icons';
import { isoDateToPretty } from '@app/domain/date';
import { useOppgaveId } from '@app/hooks/oppgavebehandling/use-oppgave-id';
import { useGetOrCreateQuery } from '@app/redux-api/forlenget-behandlingstid';
import { Label, Loader, VStack } from '@navikt/ds-react';
import { skipToken } from '@reduxjs/toolkit/query';

export const BeregnetFrist = () => {
  const id = useOppgaveId();
  const { data, isSuccess, isLoading, isError } = useGetOrCreateQuery(id ?? skipToken);

  if (isLoading) {
    return <Loader title="Laster..." size="small" />;
  }

  if (isError) {
    return <XMarkOctagonFillIconColored title="Feil ved henting av beregnet frist" />;
  }

  if (!isSuccess) {
    return null;
  }

  const { calculatedFrist } = data.behandlingstid;

  return (
    <VStack>
      <Label size="small">Beregnet frist</Label>
      <time className="mt-3" dateTime={calculatedFrist ?? undefined}>
        {calculatedFrist === null ? '-' : isoDateToPretty(calculatedFrist)}
      </time>
    </VStack>
  );
};
