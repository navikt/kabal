import { useMemo } from 'react';
import { useMatch } from 'react-router';
import {
  GOD_FORMULERING_TYPE,
  MALTEKSTSEKSJON_TYPE,
  PlainTextTypes,
  REGELVERK_TYPE,
  RichTextTypes,
  TextTypes,
} from '@app/types/common-text-types';

export const useTextType = (): TextTypes => {
  const maltekstseksjonerMatch = useMatch({ path: '/maltekstseksjoner', end: false });
  const maltekstMatch = useMatch({ path: '/maltekster', end: false });
  const redigerbarMaltekstMatch = useMatch({ path: '/redigerbare-maltekster', end: false });
  const godeFormuleringerMatch = useMatch({ path: '/gode-formuleringer', end: false });
  const regelverkMatch = useMatch({ path: '/regelverk', end: false });
  const topptekstMatch = useMatch({ path: '/topptekster', end: false });
  const bunntekstMatch = useMatch({ path: '/bunntekster', end: false });

  return useMemo(() => {
    if (maltekstseksjonerMatch !== null) {
      return MALTEKSTSEKSJON_TYPE;
    }

    if (maltekstMatch !== null) {
      return RichTextTypes.MALTEKST;
    }

    if (redigerbarMaltekstMatch !== null) {
      return RichTextTypes.REDIGERBAR_MALTEKST;
    }

    if (godeFormuleringerMatch !== null) {
      return GOD_FORMULERING_TYPE;
    }

    if (regelverkMatch !== null) {
      return REGELVERK_TYPE;
    }

    if (topptekstMatch !== null) {
      return PlainTextTypes.HEADER;
    }

    if (bunntekstMatch !== null) {
      return PlainTextTypes.FOOTER;
    }

    throw new Error('Unknown text type');
  }, [
    maltekstseksjonerMatch,
    maltekstMatch,
    redigerbarMaltekstMatch,
    godeFormuleringerMatch,
    regelverkMatch,
    topptekstMatch,
    bunntekstMatch,
  ]);
};
