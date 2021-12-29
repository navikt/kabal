import { useMemo } from 'react';
import { useKodeverkValue } from './use-kodeverk-value';
import { useOppgaveType } from './use-oppgave-type';

enum Ytelser {
  Omsorgspenger = '1',
  Opplæringspenger = '2',
  Pleiepenger_sykt_barn = '3',
  Pleiepenger_i_livets_sluttfase = '4',
  Sykepenger = '5',
  Foreldrepenger = '6',
  Svangerskapspenger = '8',
  Arbeidsavklaringspenger = '9',
  Hjelpestønad = '20',
  Grunnstønad = '21',
  Hjelpemidler = '22',
  Uføretrygd = '35',
  Yrkesskade = '36',
  Menerstatning = '37',
  Yrkessykdom = '38',
  Tvungen_forvaltning = '39',
}

const RELEVANTE_YTELSE_IDS: string[] = [
  Ytelser.Omsorgspenger,
  Ytelser.Opplæringspenger,
  Ytelser.Pleiepenger_sykt_barn,
  Ytelser.Pleiepenger_i_livets_sluttfase,
  Ytelser.Sykepenger,
  Ytelser.Foreldrepenger,
  Ytelser.Svangerskapspenger,
  Ytelser.Arbeidsavklaringspenger,
  Ytelser.Hjelpestønad,
  Ytelser.Grunnstønad,
  Ytelser.Hjelpemidler,
  Ytelser.Uføretrygd,
  Ytelser.Yrkesskade,
  Ytelser.Menerstatning,
  Ytelser.Yrkessykdom,
  Ytelser.Tvungen_forvaltning,
];

export const useIsRelevantYtelseForRaadgivende = (ytelseId: string | null): boolean => {
  const type = useOppgaveType();
  const ytelseData = useKodeverkValue('ytelser', type);

  return useMemo<boolean>(() => {
    if (typeof ytelseData === 'undefined' || ytelseId === null) {
      return false;
    }

    return ytelseData.some(({ id }) => id === ytelseId && RELEVANTE_YTELSE_IDS.includes(ytelseId));
  }, [ytelseData, ytelseId]);
};
