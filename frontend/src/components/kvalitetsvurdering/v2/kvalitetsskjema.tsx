import { Loader } from '@navikt/ds-react';
import React from 'react';
import styled from 'styled-components';
import { useOppgave } from '@app/hooks/oppgavebehandling/use-oppgave';
import { UtfallEnum } from '@app/types/kodeverk';
import { Annet } from './annet';
import { BrukAvRaadgivendeLege } from './bruk-av-raadgivende';
import { useKvalitetsvurderingV2 } from './common/use-kvalitetsvurdering-v2';
import { Klageforberedelsen } from './klageforberedelsen';
import { Utredningen } from './utredningen';
import { Vedtaket } from './vedtaket';

export const KvalitetsskjemaV2 = () => {
  const { data: oppgave, isLoading, isError } = useOppgave();
  const { isLoading: kvalitetsvurderingIsLoading } = useKvalitetsvurderingV2();

  if (isLoading || kvalitetsvurderingIsLoading) {
    return <Loader size="3xlarge" />;
  }

  if (
    typeof oppgave === 'undefined' ||
    oppgave.resultat.utfallId === UtfallEnum.TRUKKET ||
    oppgave.resultat.utfallId === UtfallEnum.RETUR ||
    oppgave.resultat.utfallId === UtfallEnum.UGUNST ||
    isError
  ) {
    return null;
  }

  return (
    <StyledKvalitetsskjema data-testid="kvalitetsskjema">
      <Klageforberedelsen />
      <Utredningen />
      <Vedtaket />
      <BrukAvRaadgivendeLege />
      <Annet />
    </StyledKvalitetsskjema>
  );
};

const StyledKvalitetsskjema = styled.section`
  display: flex;
  flex-direction: column;
  row-gap: 32px;
`;
