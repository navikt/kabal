import { useMemo } from 'react';
import { useMatch } from 'react-router';
import { PlainTextTypes, RichTextTypes, TextTypes } from '@app/types/common-text-types';

export const useTextType = (): TextTypes | undefined => {
  const maltekstseksjonerMatch = useMatch({ path: '/maltekstseksjoner', end: false });
  const maltekstMatch = useMatch({ path: '/maltekster', end: false });
  const redigerbarMaltekstMatch = useMatch({ path: '/redigerbare-maltekster', end: false });
  const godeFormuleringerMatch = useMatch({ path: '/gode-formuleringer', end: false });
  const regelverkMatch = useMatch({ path: '/regelverk', end: false });
  const topptekstMatch = useMatch({ path: '/topptekster', end: false });
  const bunntekstMatch = useMatch({ path: '/bunntekster', end: false });

  return useMemo(() => {
    if (maltekstseksjonerMatch !== null) {
      return RichTextTypes.MALTEKSTSEKSJON;
    }

    if (maltekstMatch !== null) {
      return RichTextTypes.MALTEKST;
    }

    if (redigerbarMaltekstMatch !== null) {
      return RichTextTypes.REDIGERBAR_MALTEKST;
    }

    if (godeFormuleringerMatch !== null) {
      return RichTextTypes.GOD_FORMULERING;
    }

    if (regelverkMatch !== null) {
      return RichTextTypes.REGELVERK;
    }

    if (topptekstMatch !== null) {
      return PlainTextTypes.HEADER;
    }

    if (bunntekstMatch !== null) {
      return PlainTextTypes.FOOTER;
    }

    return undefined;
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
