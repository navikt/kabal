import { useMemo } from 'react';
import { useMatch } from 'react-router';
import { TextTypes } from '../../../types/texts/texts';

export const useTextType = (): TextTypes | undefined => {
  const maltekstMatch = useMatch({ path: '/maltekster', end: false });
  const redigerbarMaltekstMatch = useMatch({ path: '/redigerbare-maltekster', end: false });
  const godeFormuleringerMatch = useMatch({ path: '/gode-formuleringer', end: false });
  const regelverkMatch = useMatch({ path: '/regelverk', end: false });
  const topptekstMatch = useMatch({ path: '/topptekster', end: false });
  const bunntekstMatch = useMatch({ path: '/bunntekster', end: false });

  return useMemo(() => {
    if (maltekstMatch !== null) {
      return TextTypes.MALTEKST;
    }

    if (redigerbarMaltekstMatch !== null) {
      return TextTypes.REDIGERBAR_MALTEKST;
    }

    if (godeFormuleringerMatch !== null) {
      return TextTypes.GOD_FORMULERING;
    }

    if (regelverkMatch !== null) {
      return TextTypes.REGELVERK;
    }

    if (topptekstMatch !== null) {
      return TextTypes.HEADER;
    }

    if (bunntekstMatch !== null) {
      return TextTypes.FOOTER;
    }

    return undefined;
  }, [maltekstMatch, redigerbarMaltekstMatch, godeFormuleringerMatch, regelverkMatch, topptekstMatch, bunntekstMatch]);
};
