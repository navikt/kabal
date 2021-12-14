import React from 'react';
import styled from 'styled-components';
import { useIsRelevantYtelseForRaadgivende } from '../../hooks/use-is-relevant-ytelse-for-raadgivende';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useKvalitetsvurdering } from '../../hooks/use-kvalitetsvurdering';
import { Annet } from './annet';
import { BrukAvRaadgivendeLege } from './bruk-av-raadgivende-lege';
import { Klageforberedelsen } from './klageforberedelsen';
import { Utredningen } from './utredningen';
import { Vedtaket } from './vedtaket';

export const Kvalitetsskjema = () => {
  const [klagebehandling] = useKlagebehandling();
  const [kvalitetsvurdering] = useKvalitetsvurdering();

  if (typeof kvalitetsvurdering === 'undefined' || typeof klagebehandling === 'undefined') {
    return null;
  }

  return (
    <StyledKvalitetsskjema>
      <Klageforberedelsen />
      <Utredningen />
      <BrukAvRaadgivendeLegeDisplay ytelse={klagebehandling.ytelse} />
      <Vedtaket />
      <Annet />
    </StyledKvalitetsskjema>
  );
};

interface BrukAvRaadgivendeLegeDisplayProps {
  ytelse: string | null;
}

const BrukAvRaadgivendeLegeDisplay = ({ ytelse }: BrukAvRaadgivendeLegeDisplayProps) => {
  const hasRelevantYtelse = useIsRelevantYtelseForRaadgivende(ytelse);

  if (hasRelevantYtelse) {
    return <BrukAvRaadgivendeLege />;
  }

  return null;
};

const StyledKvalitetsskjema = styled.div`
  margin: 30px 0;
`;
