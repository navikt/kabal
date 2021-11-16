import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useKlagebehandling } from '../../hooks/use-klagebehandling';
import { useKodeverkValue } from '../../hooks/use-kodeverk-value';
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
      <BrukAvRaadgivendeLegeDisplay tema={klagebehandling.tema} />
      <Vedtaket />
      <Annet />
    </StyledKvalitetsskjema>
  );
};

interface BrukAvRaadgivendeLegeDisplayProps {
  tema: string | null;
}

const BrukAvRaadgivendeLegeDisplay = ({ tema }: BrukAvRaadgivendeLegeDisplayProps) => {
  const hasRelevantTema = useIsRelevantTema(tema);

  if (hasRelevantTema) {
    return <BrukAvRaadgivendeLege />;
  }

  return null;
};

const useIsRelevantTema = (temaId: string | null): boolean => {
  const temaData = useKodeverkValue('temaer');

  return useMemo<boolean>(() => {
    if (typeof temaData === 'undefined' || temaId === null) {
      return false;
    }

    return ['GRU', 'SYK', 'HJE', 'AAP', 'UFO', 'YRK', 'FOR', 'OMS']
      .map((n) => temaData.find(({ navn }) => navn === n)?.id)
      .includes(temaId);
  }, [temaData, temaId]);
};

const StyledKvalitetsskjema = styled.div`
  margin: 30px 0;
`;
