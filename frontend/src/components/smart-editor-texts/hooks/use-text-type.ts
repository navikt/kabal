import { useMemo } from 'react';
import { useMatch } from 'react-router';
import { TextTypes } from '../../../types/texts/texts';

export const useTextType = (): TextTypes | undefined => {
  const maltekstMatch = useMatch({ path: '/maltekster', end: false });
  const redigerbarMaltekstMatch = useMatch({ path: '/redigerbare-maltekster', end: false });
  const godeFormuleringerMatch = useMatch({ path: '/gode-formuleringer', end: false });
  const regelverkMatch = useMatch({ path: '/regelverk', end: false });

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

    return undefined;
  }, [maltekstMatch, godeFormuleringerMatch, redigerbarMaltekstMatch, regelverkMatch]);
};
